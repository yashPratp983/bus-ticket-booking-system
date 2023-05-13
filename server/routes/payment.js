const express=require('express');
const router=express.Router();

const {payment}=require('../controller/payment');
const {protect}=require('../middleware/auth');

router.route('/').post(protect,payment);

module.exports=router;