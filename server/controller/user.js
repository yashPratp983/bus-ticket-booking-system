const db=require('../config/database');
const errorResponse = require('../utils/ErrorHandler');
const asyncHandler = require('../middleware/asyncHandler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail=require('../utils/emailHandler');

exports.signup = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    let user =await db.query('SELECT * FROM users WHERE user_email=$1',[email]);

    if(user.rows.length<=0){
        next(new errorResponse('Not authorized to book tickets',400));
    }

    if(user.rows[0].user_password!==null){
        next(new errorResponse('User already registered',400));
    }

    const salt = bcrypt.genSaltSync(10);
    const password2= await bcrypt.hash(password, salt);

    const emailToken = crypto.randomBytes(20).toString('hex');
    const emailVerificationToken = crypto.createHash('sha256').update(emailToken).digest('hex');
    const emailVerificationExpire = Date.now() + 10 * 60 * 1000;

    let updatedUser=await db.query('UPDATE users SET user_password=$1,email_verification_token=$2,email_verification_token_expire=$3 WHERE user_email=$4 RETURNING *',[password2,emailVerificationToken,emailVerificationExpire,email]);

    const jsonweb=jwt.sign({ id: user.rows[0].user_id, password: password2 }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        });
    
    updatedUser=updatedUser.rows[0];
    delete updatedUser.user_password;
    delete updatedUser.email_verification_token;
    delete updatedUser.email_verification_token_expire;
    delete updatedUser.forgot_password_token_expire;
    delete updatedUser.forgot_password_token;

    const resetUrl=`http://localhost:5173/verifyEmail/${emailVerificationToken}`

    const options = {
        email: req.body.email,
        subject: 'Email Verification',
        message: `Please verify your email by clicking on following url: \n\n ${resetUrl}`
    }

    try {
        await sendEmail(options);
    } catch (err) {
        console.log(err);
        const reset=await db.query('UPDATE users SET email_verification_token=null,email_verification_token_expire=null WHERE user_email=$1 RETURNING *',[req.body.email]);

        return next(new errorResponse('Email could not be sent', 500));
    }
    
    res.status(200).json({
        success: true,
        data: updatedUser,
        token: jsonweb
    });
});

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    let user =await db.query('SELECT * FROM users WHERE user_email=$1',[email]);

    if(user.rows.length<=0){
        return next(new errorResponse('Not authorized to book tickets',400));
    }

    if(user.rows[0].user_password===null){
        return next(new errorResponse('User not registered',400));
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].user_password);

    console.log(isMatch);

    if (!isMatch) {
        return next(new errorResponse('Invalid credentials',400));
    }

    const jsonweb=jwt.sign({ id: user.rows[0].user_id, password: user.rows[0].user_password }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        });
    
    user=user.rows[0];
    delete user.user_password;
    delete user.email_verification_token;
    delete user.email_verification_token_expire;
    delete user.forgot_password_token_expire;
    delete user.forgot_password_token;

    
    res.status(200).json({
        success: true,
        data: user,
        token: jsonweb
    });
}); 

exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await db.query('SELECT * FROM users WHERE user_id=$1',[req.user.id]);
    req.user=req.user.rows[0];
    delete req.user.user_password;
    delete req.user.email_verification_token;
    delete req.user.email_verification_token_expire;
    delete req.user.forgot_password_token_expire;
    delete req.user.forgot_password_token;

    res.status(200).json({
        success: true,
        data: req.user
    });
}
);

exports.fogotPassword = asyncHandler(async (req, res, next) => {
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    const user = await db.query('SELECT * FROM users WHERE user_email=$1',[req.body.email]);

    if(user.rows.length<=0){
        return next(new errorResponse('User not authorized',400));
    }

    const query=await db.query('UPDATE users SET forgot_password_token=$1, forgot_password_token_expire=$2 WHERE user_email=$3 RETURNING *',[resetPasswordToken,resetPasswordExpire,req.body.email]);

    const resetUrl=`http://localhost:5173/resetpassword/${resetPasswordToken}`

    const options = {
        email: req.body.email,
        subject: 'Reset Password',
        message: `You are receiving this email because you (or someone else) has requested the reset of a password. Please change your password on folloeing url: \n\n ${resetUrl}`
    }



    try {
        await sendEmail(options);

        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
        console.log(err);
        const reset=await db.query('UPDATE users SET forgot_password_token=null, forgot_password_token_expire=null WHERE user_email=$1 RETURNING *',[req.body.email]);

        return next(new errorResponse('Email could not be sent', 500));
    }
 
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
    const user = await db.query('SELECT * FROM users WHERE forgot_password_token=$1',[req.params.resetToken]);

    if(user.rows.length<=0){
        return next(new errorResponse('Invalid token',400));
    }

    if(user.rows[0].forgot_password_token_expire<Date.now()){
        return next(new errorResponse('Token expired',400));
    }

    const salt = bcrypt.genSaltSync(10);
    const password2= await bcrypt.hash(req.body.password, salt);

    const query=await db.query('UPDATE users SET user_password=$1, forgot_password_token=null, forgot_password_token_expire=null WHERE forgot_password_token=$2 RETURNING *',[password2,req.params.resetToken]);

    const jsonweb=jwt.sign({ id: query.rows[0].user_id, password: query.rows[0].user_password }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });


    res.status(200).json({ success: true, data: 'Password changed',token:jsonweb });
});

exports.verifyEmail = asyncHandler(async (req, res, next) => {
    const user = await db.query('SELECT * FROM users WHERE email_verification_token=$1',[req.params.emailVerificationToken]);
    console.log(req.params.emailVerificationToken)
    if(user.rows.length<=0){
        return next(new errorResponse('Invalid token',400));
    }

    if(user.rows[0].email_verification_token_expire<Date.now()){
        return next(new errorResponse('Token expired',400));
    }

    const query=await db.query('UPDATE users SET email_verification_token=null, email_verification_token_expire=null,is_verified=true WHERE email_verification_token=$1 RETURNING *',[req.params.emailVerificationToken]);

    const jsonweb=jwt.sign({ id: query.rows[0].user_id, password: query.rows[0].user_password }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });

    res.status(200).json({ success: true, data: 'Email verified',token:jsonweb });

});
