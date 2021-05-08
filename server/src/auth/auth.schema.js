const Joi = require('joi');

const signupSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  username: Joi.string().trim().alphanum().min(3).max(20).required(),
  password: Joi.string().trim().min(8).required(),
});

const loginEmailSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(8).required(),
});

const loginUsernameSchema = Joi.object({
  username: Joi.string().trim().alphanum().min(3).max(20).required(),
  password: Joi.string().trim().min(8).required(),
});

module.exports = {
  signupSchema,
  loginEmailSchema,
  loginUsernameSchema,
};