const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/:id').patch(authController.protect,authController.restrictTo('admin', 'lead-guide'), tourController.updateTour);

module.exports = router;
