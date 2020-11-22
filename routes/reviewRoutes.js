const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

/*
mergeParams é usado para aceder a parametros de routers diferentes
Por exemplo o tourId pertence ao router /api/v1/tours e queremos usar no /api/v1/reviews
*/
const router = express.Router({ mergeParams: true });

router.use(authController.protect);


router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.isBooked,
    reviewController.createReview
  );

router
  .route('/:id')
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  )
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .get(reviewController.getReview);

module.exports = router;
