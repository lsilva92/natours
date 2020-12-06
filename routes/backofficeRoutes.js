const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const backofficeController = require('./../controllers/backofficeController');
const viewsController = require('./../controllers/viewsController');

const router = express.Router();

router.route('/export/tours').get(authController.protect,authController.restrictTo('admin', 'lead-guide'), viewsController.checkDoc('tour'), backofficeController.excel);

router.route('/export/users').get(authController.protect,authController.restrictTo('admin', 'lead-guide'), viewsController.checkDoc('user'), backofficeController.excel);

router.route('/:id').patch(authController.protect,authController.restrictTo('admin', 'lead-guide'), tourController.updateTour);

module.exports = router;
