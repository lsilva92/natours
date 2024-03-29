/* eslint-disable */
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const viewRouter = require('../routes/viewRoutes');


exports.alerts = (req, res, next) => {
  const { alert } = req.query;

  if (alert === 'booking')
    res.locals.alert =
      'Your booking was successful! Please check email for confirmation. If your booking doesn´t show up immediatly, please come back later.';
  next();
};

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug })
    .populate({
      path: 'reviews',
      fields: 'review rating user'
    })
    .populate({
      path: 'bookings',
      fields: 'user'
    })
    .populate({
      path: 'users',
      fields: 'likedTours'
    });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  const dates = tour.startDates.length;

  if (req.cookies.jwt) {
    const currentUser = res.locals.user._id;
    let isBooked = false;
    let isLiked = false;

    if (tour.users[0]) {
      for (let i = 0; i < tour.users[0].likedTours.length; i++) {
        if (tour.users[0].likedTours[i]._id.equals(tour._id)) {
          isLiked = true;
        }
      }
    }

    for (let i = 0; i < tour.bookings.length; i++) {
      if (tour.bookings[i].user._id.equals(currentUser)) {
        isBooked = true;
      }
    }
    res.status(200).render('tour', {
      title: `${tour.name} Tour`,
      tour,
      isBooked,
      isLiked,
      dates
    });
  } else {
    res.status(200).render('tour', {
      title: `${tour.name} Tour`,
      tour,
      dates
    });
  }
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  //1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  //2) Find tours with the the returned IDs
  const tourIDs = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  if (tours.length < 1){
    res.status(200).render('overview', {
      title: 'My Tours'
    });
  }else {
    res.status(200).render('overview', {
      title: 'My Tours',
      tours
    });
  }
});

exports.myReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user.id }).populate('tour');
  
  if(reviews < 1){
    res.status(200).render('myReviews', {
      title: 'My Reviews'
    });
  }else{
    res.status(200).render('myReviews', {
      title: 'My Reviews',
      reviews
    });
  }
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  res.status(200).render('reviewDetail', {
    title: 'My Review Detail',
    review
  });
});

exports.getFavorites = catchAsync(async (req, res, next) => {
  //1) Find Favorite tours for logged user
  const user = await User.findById(req.user.id);
  const tourIds = user.likedTours.map(el => el._id);
  console.log(user);
  console.log(tourIds);

  const tours = await Tour.find({ _id: { $in: tourIds } });

  //2)render overview with tour id's retruned in the previous step
  res.status(200).render('overview', {
    Title: 'Favorite Tours',
    tours
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});

exports.signUp = (req, res) => {
  res.status(200).render('signUp', {
    title: 'Sign Up'
  });
};

exports.checkDoc = doc => {
  return (req, res, next) => {
    req.body.doc = doc;
    next();
  };
};

exports.manageDocs = catchAsync(async (req, res, next) => {
  if (req.body.doc === 'tour') {
    const tours = await Tour.find().select('name duration price maxGroupSize');

    const columns = [
      'Tour Name',
      'Duration',
      'Price',
      'MaxGroupSize',
      'Actions'
    ];
    const domID = ['tour', 'duration', 'price', 'maxGroupSize', 'actions'];
    const table = 'tour';
    const ids = [];
    const tourDuration = [];
    const tourPrice = [];
    const tourGroupSize = [];
    const tourNames = [];

    for (let i = 0; i < tours.length; i++) {
      ids.push(tours[i]._id);
      tourNames.push(tours[i].name);
      tourDuration.push(tours[i].duration);
      tourPrice.push(tours[i].price);
      tourGroupSize.push(tours[i].maxGroupSize);
    }

    res.status(200).render('manageBO', {
      title: 'Manage Tours',
      table,
      domID,
      ids,
      columns,
      docs: [tourNames, tourDuration, tourPrice, tourGroupSize]
    });
  } else if (req.body.doc === 'user') {
    const users = await User.find().select('name email role active retry');
    const columns = ['User', 'Email', 'Role', 'Active', 'Retry', 'Actions'];
    const table = 'user';
    const domID = ['user', 'email', 'role', 'active', 'retry', 'actions'];
    const ids = [];
    const userName = [];
    const email = [];
    const role = [];
    const active = [];
    const retry = [];

    for (let i = 0; i < users.length; i++) {
      ids.push(users[i]._id);
      userName.push(users[i].name);
      email.push(users[i].email);
      role.push(users[i].role);
      active.push(users[i].active);
      retry.push(users[i].retry);
    }

    res.status(200).render('manageBO', {
      title: 'Manage Users',
      table,
      ids,
      domID,
      columns,
      docs: [userName, email, role, active, retry]
    });
  } else {
    return next(new AppError('No document Found', 400));
  }
});

exports.newTour = catchAsync(async (req, res) => {
  res.status(200).render('newTour', {
    title: 'New Tour'
  });
});
