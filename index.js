require('dotenv').config()
const express = require('express');
const { sequelize } = require('./db');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { expressjwt } = require('express-jwt');
const rateLimit = require('express-rate-limit')
const auth = require('./routes/auth');
const profile = require('./routes/profile');

(async () => {
    await sequelize.sync({ force: true });
})();

const app = express();
const port = 3000;

app.use(cookieParser())
//allow frontend to access the api
app.use(cors())

//use this in production with frontend origin
// app.use(cors({
//     origin: 'http://yourapp.com'
//   }));

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

//prevent brute force attack
const loginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message:
        'Too many login attempt made from this IP, please try again after an hour',
    standardHeaders: true, 
    legacyHeaders: false, 
})

//prevent spam
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message:
        'Too many accounts created from this IP, please try again after an hour',
    standardHeaders: true,
    legacyHeaders: false,
});


//mitigate DDOS attack
const accessLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message:
        'Too many access made from this IP, please try again later',
    standardHeaders: true, 
    legacyHeaders: false, 
});


app.post('/auth/login', loginLimiter, auth.login);
app.post('/auth/register', registerLimiter, auth.register);
app.post('/auth/refresh', accessLimiter, auth.refresh);
app.post('/auth/logout', accessLimiter, auth.logout);

app.use('/profile/', accessLimiter);

app.get('/profile', expressjwt({ secret: process.env.ACCESS_TOKEN_SECRET, algorithms: ["HS256"] }), profile.get);
app.post('/profile', expressjwt({ secret: process.env.ACCESS_TOKEN_SECRET, algorithms: ["HS256"] }), profile.post);

app.use(function (err, req, res, next) {
    if (err.name === "UnauthorizedError")
        return res.status(401).send("Invalid token");

    return res.status(401).send("Something bad happened");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});