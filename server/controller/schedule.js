const db=require('../config/database');
const errorResponse = require('../utils/ErrorHandler');
const asyncHandler = require('../middleware/asyncHandler');
const ejs=require('ejs');


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

exports.getTickets=asyncHandler(async (req,res,next)=>{
    const tickets=await db.query('select transaction_id,user_id,journey.bus_name,booking_date,starting_address,destination_address,leaving_time,journey.journey_id from booked_tickets cross join journey where booked_tickets.journey_id=journey.journey_id and user_id=$1',[req.user.user_id]);

    tickets.rows.forEach((ticket)=>{
        ticket.booking_date=ticket.booking_date.toISOString().split('T')[0];
    });

    res.status(200).json({
        success:true,
        data:{
            tickets:tickets.rows,
        }
    });
});

exports.getPrintedTicket=asyncHandler(async (req,res,next)=>{
    const journey=await db.query('SELECT * FROM journey WHERE journey_id=$1',[req.params.journey_id]);
    const booking=await db.query('SELECT * FROM booked_tickets WHERE transaction_id=$1',[req.params.transaction_id]);

    if(journey.rows.length==0){
        return next(new errorResponse('Invalid journey id',404));
    }

    if(booking.rows.length==0){
        return next(new errorResponse('No tickets found for given journey',404));
    }
    
    if(booking.rows[0].user_id!=req.user.user_id){
        return next(new errorResponse('You are not authorized to view this ticket',401));
    }

    let booking_date=booking.rows[0].booking_date;
    booking_date=booking_date.toISOString().split('T')[0];

    const html=await ejs.renderFile('./views/ticket.ejs',{booking:booking.rows[0],journey:journey.rows[0],user:req.user,date:booking_date});

    res.status(200).json({
        success:true,
        data:{
            html:html,
        }
    });
});