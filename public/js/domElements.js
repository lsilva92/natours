/* eslint-disable */
export const elements = {
  //tour.pug
  mapBox: document.getElementById('map'),
  bookBtn: document.getElementById('book-tour'),
  addReview: document.querySelector('.add__review'),
  reviewForm: document.querySelector('.review__form'),
  reviewStar: document.querySelector('.reviews__ratingpop'),
  reviewFormSub: document.querySelector('.form-review'),
  likeTour: document.querySelector('.favorite'),

  //manageBo.pug
  confirmYes: document.getElementById('confirm-yes'),
  confirmNo: document.getElementById('confirm-no'),
  exportTourBtn: document.getElementById('tours'),
  exportUserBtn: document.getElementById('users'),
  editTable: document.querySelectorAll('.edit__icon'),
  tableBtn: document.querySelectorAll('.btn--table'),
  deleteBtn: document.querySelectorAll('.delete'),
  cancelBtn: document.querySelectorAll('.cancel'),
  saveBtn: document.querySelectorAll('.save'),
  table: document.getElementsByTagName('table'),
  tourTable: document.querySelector('.tour'),
  userTable: document.querySelector('.user'),

  //Pop Ups
  popUpCard: document.querySelector('.popupcard'),

  //login/logout
  loginForm: document.querySelector('.form--login'),
  logOutBtn: document.querySelector('.nav__el--logout'),

  //acount.pug
  userDataForm: document.querySelector('.form-user-data'),
  userPasswordForm: document.querySelector('.form-user-password'),

  //signUp.pug
  userSignUpForm: document.querySelector('.form--signup'),

  //newTour.pug
  newTourForm: document.querySelector('.form--newTour'),
  difficultyCheck: document.querySelectorAll('.check--radio'),

  //reviewDetail.pug
  reviewBtn: document.getElementById('detail-review'),
  editReviewForm: document.querySelector('.form--review')
};
