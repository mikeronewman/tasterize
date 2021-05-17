const express = require('express');

const controller = require('./auth.controller');
const middlewares = require('./auth.middlewares');

// All routes defined in this file are prepended with /auth
const router = express.Router();

const defaultLoginError = 'Unable to login';
const signInError = 'That username is already taken, please chose another one.';

router.post(
    '/signup',
    middlewares.validateUser(),
    middlewares.findUser(signInError, (user) => user, 409),
    controller.signup,
);

router.post(
    '/login',
    middlewares.validateUser(defaultLoginError),
    middlewares.findUser(defaultLoginError, (user) => !(user && user.active)),
    controller.login,
);

module.exports = router;