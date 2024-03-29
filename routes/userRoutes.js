const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const bookingRouter = require('./bookingRoutes');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.use('/:userId/reviews', reviewRouter);

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//Vai correr o middlerware protect antes de avançar para os routers abaixo
router.use(authController.protect);

router.use('/:userId/bookings', bookingRouter);

router.patch('/updateMyPassword', authController.updatePassword);

router
  .route('/likeTour')
  .post(userController.likeTour)
  .delete(userController.deleteFavoriteTour);

//authController.protect se if user is log in and allows to read user id from req.user.id
router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
