const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../db/connection');
const users = db.get('users');
const { signupSchema, loginEmailSchema, loginUsernameSchema } = require('./auth.schema');

const router = express.Router();

const respondLoginError = (res, next) => {
  res.status(422);
  const error = new Error('Unable to login.');
  next(error);
}

const createTokenSendResponse = (user, res, next) => {
  const payload = {
    _id: user.id,
    username: user.username,
    email: user.email
  };

  jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: '1h'
  }, (err, token) => {
    if (err) {
      respondLoginError(res, next);
    } else {
      res.json({
        token
      });
    }
  });
}

router.get('/', (req, res) => {
  res.json({
    message: 'Hello from the /auth/ route!',
  });
});

router.post('/signup', (req, res, next) => {
  const result = signupSchema.validate(req.body);
  if (!result.error) {
    users.findOne({
      email: req.body.email
    }).then(user => {
      // if an email address is found, someone with that email address is already registered
      if (user) {
        const error = new Error('Sorry, someone with that email address is already registered here.');
        res.status(409);
        next(error);
      } else {
        users.findOne({
          username: req.body.username
        }).then(user => {
          if (user) {
            const error = new Error('Sorry, that username is already taken! Please pick another one.');
            res.status(409);
            next(error);
          } else {
            // hash the password
            bcrypt.hash(req.body.password.trim(), 12).then(hashedPassword => {
              // insert the user with the hashed password
              const newUser = {
                email: req.body.email,
                username: req.body.username,
                password: hashedPassword,
              };
              users.insert(newUser).then(insertedUser => {
                createTokenSendResponse(insertedUser, res, next);
              });
            });
          }
        });
      }
    });
  } else {
    res.status(422);
    next(result.error);
  }
});

router.post('/login/email', (req, res, next) => {
  const result = loginEmailSchema.validate(req.body);
  if (!result.error) {
    users.findOne({
      email: req.body.email
    }).then(user => {
      if (user) {
        bcrypt.compare(req.body.password, user.password).then(result => {
          if (result) {
            createTokenSendResponse(user, res, next);
          } else {
            respondLoginError(res, next);
          }
        });
      } else {
        respondLoginError(res, next);
      }
    })
  } else {
    respondLoginError(res, next);
  }
});

router.post('/login/username', (req, res, next) => {
  const result = loginUsernameSchema.validate(req.body);
  if (!result.error) {
    users.findOne({
      username: req.body.username
    }).then(user => {
      if (user) {
        bcrypt.compare(req.body.password, user.password).then(result => {
          if (result) {
            createTokenSendResponse(user, res, next);
          } else {
            respondLoginError(res, next);
          }
        });
      } else {
        respondLoginError(res, next);
      }
    });
  } else {
    respondLoginError(res, next);
  }
})

module.exports = router;