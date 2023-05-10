const db=require('../config/database');
const asyncHandler = require('../middleware/asyncHandler');
const errorResponse = require('../utils/ErrorHandler');


exports.payment=asyncHandler(async (req,res,next)=>{
    console.log(req.body);

    res.status(200).send('Payment Successful');
});