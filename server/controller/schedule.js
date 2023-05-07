const db=require('../config/database');
const errorResponse = require('../utils/ErrorHandler');

exports.getSchedule=async (req,res,next)=>{
    try{
        const schedule1=await db.query('SELECT * FROM bus1');
        const schedule2=await db.query('SELECT * FROM bus2');
        console.log(schedule1,"schedule1");
        console.log(schedule2,"schedule2");

        res.status(200).json({
            success:true,
            data:{
                schedule1:schedule1.rows,
                schedule2:schedule2.rows
            }
        });
    }catch(err){
        return next(new errorResponse('Server Error',500));
    }
}