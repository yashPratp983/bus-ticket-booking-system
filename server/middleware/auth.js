const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const errorResponse = require('../utils/ErrorHandler')
const db=require('../config/database');
const bcrypt = require('bcrypt');

exports.protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorisation && req.headers.authorisation.startsWith('Bearer')) {
        token = req.headers.authorisation.split(' ')[1];
    }
    else{
        next(new errorResponse('Not authorize to access the route', 401))

    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)
        let user = await db.query('SELECT * FROM users WHERE user_id=$1', [decoded.id]);

        if (user && user.rows.length > 0 && user.rows[0].user_password !== null && user.rows[0].user_password === decoded.password && user.rows[0].user_id === decoded.id) {
            req.user = user;
        }
        if (!user || user.rows[0].user_password !== decoded.password || user.rows[0].user_id !== decoded.id || user.rows[0].user_password === null || user.rows.length <= 0) {
            next(new errorResponse('Not authorize to access the route', 401))
        }
        next();

    } catch (err) {

        next(new errorResponse('Not authorize to access the route', 401))
    }
})


