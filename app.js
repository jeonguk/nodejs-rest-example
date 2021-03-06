const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRouts = require('./api/routes/user')

mongoose.connect('mongodb://localhost:27017/node-shop', {
    useMongoClient: true
});

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads')); // static file path use
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

// Routes which shuld handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRouts);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status(404);
    next(error);
});

app.use((error, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;