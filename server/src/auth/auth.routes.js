const express = require('express');

const controller = require('./auth.controller');
const middlewares = require('./auth.middlewares');

// All routes defined in this file are prepended with /auth
const router = express.Router();



module.exports = router;