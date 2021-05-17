const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

require('dotenv').config();

const app = express();

const auth = require('./auth/auth.routes');

app.use(morgan('tiny'));
app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(express.json());
app.use(helmet());

app.get('/', (req, res) => {
    res.json({
        message: 'Hello World!'
    });
});

app.use(
    '/auth',
    auth,
);

function notFound(req, res, next) {
    res.status(404);
    const error = new Error(`Not Found - ${ req.originalUrl }`);
    next(error);
}

function errorHandler(err, req, res, next) {
    res.status(res.statusCode || 500);
    res.json({
        message: err.message,
        stack: err.stack,
    });
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;