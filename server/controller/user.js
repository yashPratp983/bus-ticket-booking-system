const db=require('../config/database');
const errorResponse = require('../utils/ErrorHandler');
const asyncHandler = require('../middleware/asyncHandler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

    let updatedUser=await db.query('UPDATE users SET user_password=$1 WHERE user_email=$2 RETURNING *',[password2,email]);

    const jsonweb=jwt.sign({ id: user.rows[0].user_id, password: password2 }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        });
    
    updatedUser=updatedUser.rows[0];
    delete updatedUser.user_password;

    
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

    res.status(200).json({
        success: true,
        data: req.user
    });
}
);
