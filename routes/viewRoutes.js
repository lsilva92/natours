const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(viewsController.alerts);

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/signup', viewsController.signUp);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);

router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-tours', authController.protect, viewsController.getMyTours);
router.get(
  '/my-favorite-tours',
  authController.protect,
  viewsController.getFavorites
);
router.get('/myReviews', authController.protect, viewsController.myReviews);
router.get('/myReviews/:id', authController.protect, viewsController.getReview);

router.get(
  '/manageTours',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.checkDoc('tour'),
  viewsController.manageDocs
);
router.get(
  '/manageUsers',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.checkDoc('user'),
  viewsController.manageDocs
);
router.get(
  '/newTour',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.newTour
);

router.post('/submit-user-data', viewsController.updateUserData);

module.exports = router;
