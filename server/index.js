const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./config/database');
const users = require('./routes/user');
const schedule = require('./routes/schedule');
const morgan = require('morgan');
const booking=require('./routes/payment');
const cron=require('node-cron');


const errorHandler = require('./middleware/errorHandler');

const app = express();

dotenv.config({ path: './config/config.env' })


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use('/api/v1/users', users);
app.use('/api/v1/schedule', schedule);
app.use('/api/v1/booking',booking);

app.use(errorHandler);

cron.schedule('0 0 * * *',async ()=>{
    try{
    const journey=await db.query('UPDATE journey SET remaining_seats=60');
    }catch(err){
        console.log(err)
    }
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
