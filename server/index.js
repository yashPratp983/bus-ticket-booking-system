const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./config/database');
const users = require('./routes/user');
const schedule = require('./routes/schedule');
const morgan = require('morgan');
const booking=require('./routes/payment');
const cron=require('node-cron');
const http2=require('http2');
const spdy=require('spdy');
const fs=require('fs');

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

app.get('/', (req, res) => {
    res.send(`Server running on port ${req.protocol}://${req.hostname}:${req.socket.localPort}`);
    
});

app.use(errorHandler);

cron.schedule('0 0 * * *',async ()=>{
    try{
    const journey=await db.query('UPDATE journey SET remaining_seats=60');
    }catch(err){
        console.log(err)
    }
});

const options = {
  key: fs.readFileSync('cert/key.pem'),
  cert: fs.readFileSync('cert/cert.pem')
};

const server1 = spdy.createServer(options, app);


const port1 = 3001;
server1.listen(port1, () => {
  console.log(`HTTP/2 server running on port ${port1}`);
});

const server2 = spdy.createServer(options,app);




const port2 = 3002;
server2.listen(port2, (err) => {
  console.log(`HTTP/2 server running on port ${port2}`);
  if(err){
      console.log(err);
  }
});

const server3 = spdy.createServer(options,app);



const port3 = 3000;
server3.listen(port3, () => {
  console.log(`HTTP/2 server running on port ${port3}`);
});

