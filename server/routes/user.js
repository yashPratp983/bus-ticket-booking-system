const express=require('express');
const router=express.Router();

const db=require('../config/database');

const {signup,login,getMe}=require('../controller/user');
const {protect}=require('../middleware/auth');

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/me').get(protect,getMe)


module.exports=router;
