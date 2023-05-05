const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./config/database');
const users = require('./routes/user');
const morgan = require('morgan');


const errorHandler = require('./middleware/errorHandler');

const app = express();

dotenv.config({ path: './config/config.env' })


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use('/api/v1/users', users);
app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
