const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

require('dotenv').config();

const app = express();

const auth = require('./auth/auth.routes');
const middlewares = require('./auth/auth.middlewares');
const api = require('./api/api.routes');

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}

app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet());
app.use(middlewares.checkTokenSetUser);

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨Hello World! 🌈✨🦄',
  });
});

app.use('/auth', auth);
app.use('/api/v1', api);

function notFound(req, res, next) {
  res.status(404);
  const error = new Error('Not found - ' + req.originalUrl);
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

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Listening on port', port)
});