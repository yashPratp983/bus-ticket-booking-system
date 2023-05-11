const db=require('../config/database');
const asyncHandler = require('../middleware/asyncHandler');
const errorResponse = require('../utils/ErrorHandler');
const stripe=require('stripe')('sk_test_51N5rooSFRPrc5koGOeIm7ttNxrsS1Z0tPaqVLKuUub12NbU09nLfAWqqbo41OdUrgdFuYBMRaFEIJnyKS3rXcWHi00GfKlPkzI');
const uuid=require('uuid').v4;
// const axios=require('axios');

exports.payment=asyncHandler(async (req,res,next)=>{
    // console.log(process.env.STRIPE_SECRET_KEY)

    console.log(req.body);
    // const time=await axios.get("https://worldtimeapi.org/api/timezone/asia/kolkata")
    // const date=new Date(time.data.datetime)
    // const timeStr = date.toLocaleTimeString('en-US', {hour12: false});

    const journey=await db.query('SELECT * FROM journey WHERE journey_id=$1',[req.body.journey_id]);

    let error,status

    try{

    const customer=await stripe.customers.create({
        email:req.body.token.email,
        source:req.body.token.id,
        
    });

    // console.log(stripe.paymentIntent)

    const key=uuid();

    console.log(req.body.token.card.number)

    const charge=await stripe.paymentIntents.create({
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

        // shipping:{
        //     name:req.body.token.card.name,
        //     address:{
        //         line1:req.body.token.card.address_line1,
        //         line2:req.body.token.card.address_line2,
        //         city:req.body.token.card.address_city,
        //         state:req.body.token.card.address_state,
        //         postal_code:req.body.token.card.address_zip,

        //         country:req.body.token.card.address_country
        //     }
        // }
    },{
        idempotencyKey:key
    })

    console.log(charge) 
    }catch(err){
        console.log(err,"error")
    }
    
    // await db.beginTransaction();

    //     if(journey.rows.length==0){
    // try{
    //     const journey=await db.query('SELECT * FROM journey WHERE journey_id=$1',[req.body.journey_id]);
    //         await db.rollback();
    //         return next(new errorResponse('No journey found',404));
    //     }

    //     if(journey.rows[0].remaining_seats<=0){
    //         await db.rollback();
    //         return next(new errorResponse('No seats available',404));
    //     }

    //     if(journey.leaving_time<timeStr){
    //         await db.rollback();
    //         return next(new errorResponse('bus left the campus',404));
    //     }

        

    //     console.log(paymentIntent)
    //     // const updateJourney=await db.query('UPDATE journey SET remaining_seats=remaining_seats-$2 WHERE journey_id=$1',[req.body.journey_id,req.body.number_of_seats]);

        

    // }catch(err){
    //     console.log(err)

    //     await db.rollback();
    //     return next(new errorResponse('Payment failed',500));
    // }
});