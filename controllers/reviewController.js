const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');
const Booking = require('../models/bookingModel');
const AppError = require('./../utils/appError');

exports.setTourUserIds = (req, res, next) => {
  //Allow nested routes
  //Se o tour não existir no body usar o id no url
  if (!req.body.tour) req.body.tour = req.params.tourId;
  //mesmo que o de cima mas neste caso o req.user.id vem do protect middleware
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.isBooked = async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });
  const tourIds = bookings.map(el => el.tour.id);

  if (tourIds.includes(req.body.tour)) return next();

  return next(new AppError('The user did not booked this tour', 400));
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
