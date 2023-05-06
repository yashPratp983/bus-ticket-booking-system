const express=require('express');
const router=express.Router();

const db=require('../config/database');

const {signup,login,getMe,fogotPassword,resetPassword,verifyEmail}=require('../controller/user');
const {protect}=require('../middleware/auth');

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/me').get(protect,getMe)
router.route('/forgotpassword').post(fogotPassword);
router.route('/resetpassword/:resetToken').put(resetPassword);
router.route('/verifyemail/:emailVerificationToken').get(verifyEmail);

module.exports=router;
