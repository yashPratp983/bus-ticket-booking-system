const express=require('express');
const router=express.Router();

const db=require('../config/database');

const {getSchedule,getTickets,getPrintedTicket}=require('../controller/schedule');
const {protect}=require('../middleware/auth');

router.route('/bus_schedule').get(getSchedule);
router.route('/tickets').get(protect,getTickets);
router.route('/tickets/:journey_id/:transaction_id').get(protect,getPrintedTicket);

module.exports=router;