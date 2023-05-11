const db=require('../config/database');
const errorResponse = require('../utils/ErrorHandler');


exports.getSchedule=async (req,res,next)=>{
    try{
        const schedule=await db.query('SELECT * FROM journey');

        res.status(200).json({
            success:true,
            data:{
                schedule:schedule.rows,
            }
        });
    }catch(err){
        return next(new errorResponse('Server Error',500));
    }
}