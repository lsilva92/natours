/* eslint-disable */

/*Index.js purpose is to get data from user interface and delegate actions to the modules*/

import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { signUp } from './signUp';
import { bookTour } from './stripe';
import { showAlert } from './alerts';
import { createReview, editReview } from './review';
import { addLikeTour, deleteLikeTour } from './like';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const userSignUpForm = document.querySelector('.form--signup');
const bookBtn = document.getElementById('book-tour');
const reviewBtn= document.getElementById('detail-review');
const popUpCard = document.querySelector('.popupcard');
const addReview = document.querySelector('.add__review');
const editReviewForm = document.querySelector('.form--review');
const reviewForm = document.querySelector('.review__form');
const reviewStar = document.querySelector('.reviews__ratingpop');
const reviewFormSub = document.querySelector('.form-review');
const likeTour = document.querySelector('.favorite');

//VALUES

//DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save--password').textContent = 'Updating...';
    const currentPassword = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { currentPassword, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save--password').textContent =
      'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (userSignUpForm)
  userSignUpForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    signUp({ name, email, password, passwordConfirm });
  });
  
if(editReviewForm)  
  editReviewForm.addEventListener('submit', e=>{
    e.preventDefault();
    const { reviewId } = reviewBtn.dataset;
    const review= document.getElementById('review').value;
    const ratings = []
    const stars = document.querySelector('.reviews__ratingpop').querySelectorAll('.reviews__star--active')
    
    for (let i= 0; i < stars.length; i++){
      ratings.push(stars[i].dataset.reviewId)
    }
    const rating = Math.max(...ratings)
    
    editReview(reviewId, review, rating)
  });



if (bookBtn)
  bookBtn.addEventListener('click', e => {
    popUpCard.style.display='block';
    
    const { tourId } = e.target.dataset;
    
  //Se clicar fora do pop up, fecha-o
  window.onclick = function(e) {
    if (e.target == popUpCard) {
      popUpCard.style.display = 'none';
    }else if (e.target.id == 'myPopup0'){
      const {tourDate}  = e.target.dataset
      bookTour(tourId, tourDate);
    }else if (e.target.id == 'myPopup1'){
      const { tourDate } = e.target.dataset
      bookTour(tourId, tourDate);
    }else if (e.target.id == 'myPopup2'){
      const { tourDate } = e.target.dataset
      bookTour(tourId, tourDate);
    }
  }
});

function reviewAddEdit(item){ 
    console.log(item)
    item.addEventListener('click', e => {
    reviewForm.style.display='block';
    
    window.onclick = function(e) {
      if (e.target == reviewForm){
        reviewForm.style.display = 'none'
      }
    }
  });
}

  
if(addReview)
  reviewAddEdit(addReview);

 
  if(reviewStar)
    reviewStar.addEventListener('click', e => {
      const star = [1,2,3,4,5];
      const rating = e.target.id;
      
      for(let i = 0; i < star.length; i++){
        if (rating >= star[i]){
          document.getElementById(`${star[i]}`).classList.remove('reviews__star--inactive');
          document.getElementById(`${star[i]}`).classList.add('reviews__star--active')
        }else{
            document.getElementById(`${star[i]}`).classList.remove('reviews__star--active');
            document.getElementById(`${star[i]}`).classList.add('reviews__star--inactive');
        }
      }
});
    
if (reviewFormSub)
    reviewFormSub.addEventListener('submit', e => {
    e.preventDefault();
    const review = document.getElementById('review').value;
    
    const ratings = []
    const stars = document.querySelector('.reviews__ratingpop').querySelectorAll('.reviews__star--active')
    
    for (let i= 0; i < stars.length; i++){
      ratings.push(stars[i].dataset.reviewId)
    }
    const rating = Math.max(...ratings)
    const tourId = document.getElementById('review-tour').dataset.tourId
    createReview(tourId, review, rating);
  });
  
if(likeTour)
  likeTour.addEventListener('click', e => {
    const like = document.querySelector('.like__icon').classList.toggle('liked');
    
    const tourId = document.querySelector('.like__icon').dataset.tourId;
    
    if(like){
      addLikeTour(tourId);
    }else{
      deleteLikeTour(tourId);
    }
  })

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20); 
