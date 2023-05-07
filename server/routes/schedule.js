const express=require('express');
const router=express.Router();

const db=require('../config/database');

const {getSchedule}=require('../controller/schedule');

router.route('/').get(getSchedule);

module.exports=router;