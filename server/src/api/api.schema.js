const Joi = require('joi');

const reviewSchema = Joi.object({
  userId: Joi.string().required(),
  name: Joi.string().required(),
  distillery: Joi.string().required(),
  category: Joi.string().required(),
  abv: Joi.number().max(100),
  date: Joi.date(),
  tags: Joi.array(),
  nose: Joi.number().min(1).max(10),
  palate: Joi.number().min(1).max(10),
  finish: Joi.number().min(1).max(10),
  reviewBody: Joi.string(),
});

module.exports = {
  reviewSchema,
};