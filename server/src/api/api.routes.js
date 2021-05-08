const express = require('express');

const db = require('../db/connection');
const reviews = db.get('reviews');
const { reviewSchema } = require('./api.schema');

const router = express.Router();

// Routes all prepended with /api/v1/
router.get('/reviews', (req, res) => {
  // return all reviews
  res.json({
    message: 'Hello from the /api/v1/ route!',
  });
});

router.post('/reviews/', (req, res) => {
  const result = reviewSchema.validate(req.body);
  if (!result.error) {
    const newReview = {
      userId: req.body.userId,
      name: req.body.name,
      distillery: req.body.distillery,
      category: req.body.category,
      abv: req.body.abv,
      date: new Date(),
      tags: req.body.tags,
      nose: req.body.nose,
      palate: req.body.palate,
      finish: req.body.finish,
      reviewBody: req.body.reviewBody,
    };
    reviews.insert(newReview);
    res.json(newReview);https://www.techelevator.com/
  } else {
    res.status(422);
    next(result.error);
  }
});

router.get('/reviews/:id', (req, res) => {
  // return reviews made by a specific user's id
});

module.exports = router;