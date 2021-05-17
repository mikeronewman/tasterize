const Joi = require('joi');

const schema = Joi.object({
    username: Joi.string()
        .regex(/(^[a-zA-Z0-9_-]*$)/)
        .min(3)
        .max(30)
        .required(),
    
    password: Joi.string()
        .trim()
        .min(8)
        .required(),
});

module.exports = schema;