const db=require('../config/database');
const asyncHandler = require('../middleware/asyncHandler');
const errorResponse = require('../utils/ErrorHandler');
const stripe=require('stripe')('sk_test_51N5rooSFRPrc5koGOeIm7ttNxrsS1Z0tPaqVLKuUub12NbU09nLfAWqqbo41OdUrgdFuYBMRaFEIJnyKS3rXcWHi00GfKlPkzI');
const uuid=require('uuid').v4;
const axios=require('axios');
const ejs=require('ejs');

exports.payment=asyncHandler(async (req,res,next)=>{
    try{
    const time=await axios.get("https://worldtimeapi.org/api/timezone/asia/kolkata")
    const dat=new Date(time.data.datetime)
    let timestr = dat.toLocaleTimeString('en-US', {hour12: false});
    console.log(timestr)
    try{
    
    // await db.query('BEGIN TRANSACTION');

    const journey=await db.query('SELECT * FROM journey WHERE journey_id=$1',[req.body.journey_id]);


        if(journey.rows.length==0){
            // await db.query('ROLLBACK');
            return next(new errorResponse('No journey found',404));
        }

        if(journey.rows[0].remaining_seats<=0){
            // await db.query('ROLLBACK');
            return next(new errorResponse('No seats available',404));
        }
        console.log(journey.rows[0].leaving_time)
        
        if(String(timestr)<'10:00:00' || timestr>=journey.rows[0].leaving_time){
            // await db.query('ROLLBACK');
            return next(new errorResponse('bus left the campus',404));
        }

        try{
        const customer=await stripe.customers.create({
            email:req.body.token.email,
            source:req.body.token.id,
            
        });

    // console.log(stripe.paymentIntent)

        const key=uuid();

        console.log(req.body.token.card.number)

        var charge=await stripe.paymentIntents.create({
            amount:1000*req.body.number_of_seats,
            currency:'inr',
            customer:customer.id,
            receipt_email:req.body.token.email,
            payment_method:req.body.token.card.id,
            payment_method_types:['card'],
            description:`Purchased the ${req.body.number_of_seats} seats`,
            confirm:true,
            payment_method_options: {
                card: {
                request_three_d_secure: 'any',
                },
            },
            shipping:{
                name:req.body.token.card.name,
                address:{
                    line1:req.body.token.card.address_line1,
                    line2:req.body.token.card.address_line2,
                    city:req.body.token.card.address_city,
                    state:req.body.token.card.address_state,
                    postal_code:req.body.token.card.address_zip,

                    country:req.body.token.card.address_country
                }
            }
        },{
            idempotencyKey:key
        })

        const unixTimestamp = charge.created;
        const date = new Date(unixTimestamp * 1000); // multiply by 1000 to convert to milliseconds

        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const dateStr = `${day}/${month}/${year}`;

        const timeStr = date.toLocaleTimeString('en-US', {hour12: false});
        console.log(dateStr,"date in payment")
        if(charge.status=='succeeded'){
            try{
            await db.query('BEGIN TRANSACTION');
            const payment=await db.query('INSERT INTO payments (payment_id,user_id,amount,journey_id,date_of_payment,time_of_payment) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',[charge.id,req.user.user_id,charge.amount/100,req.body.journey_id,dateStr,timeStr]);
            await db.query('COMMIT');
            }catch(err){
                console.log(err)
                await db.query('ROLLBACK')
                return next(new errorResponse('Unable to book ticket',500));
            }
        
        }else{
            return next(new errorResponse('Payment failed',500));
        }
        }catch(err){
        console.log(err,"error in payment")
        return next(new errorResponse('Payment failed',500));
        }
        const unixTimestamp = charge.created;
        const date = new Date(unixTimestamp * 1000); // multiply by 1000 to convert to milliseconds

        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const dateStr = `${day}/${month}/${year}`;


        const timeStr = date.toLocaleTimeString('en-US', {hour12: false});

        try{
     
        await db.query('BEGIN TRANSACTION');
     
        var booking=await db.query('INSERT INTO booked_tickets (transaction_id,user_id,journey_id,no_of_tickets,bus_name,booking_time,booking_date) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',[charge.id,req.user.user_id,req.body.journey_id,req.body.number_of_seats,journey.rows[0].bus_name,timeStr,dateStr]);

        var updateJourney=await db.query('UPDATE journey SET remaining_seats=remaining_seats-$2 WHERE journey_id=$1',[req.body.journey_id,req.body.number_of_seats]);       

        await db.query('COMMIT');
        }catch(err){
            console.log(err)
            await db.query('ROLLBACK')
            return next(new errorResponse('Unable to book ticket',500));
        }

        const html=await ejs.renderFile('./views/ticket.ejs',{booking:booking.rows[0],journey:journey.rows[0],user:req.user,date:dateStr});
        return res.status(200).json({
            success:true,
            data:booking.rows[0],
            html:html
        })
    }catch(err){
        console.log(err)

        return next(new errorResponse('Unable to book ticket',500));
    }
}catch(err){
    console.log(err)

    return next(new errorResponse('Unable to book ticket',500));
}
});