/* eslint-disable */

/*Index.js purpose is to get data from user interface and delegate actions to the modules*/

import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { signUp } from './signUp';
import { bookTour } from './stripe';
import { showAlert } from './alerts';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const userSignUpForm = document.querySelector('.form--signup');
const bookBtn = document.getElementById('book-tour');
const popUpCard = document.querySelector('.popupcard');

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



if (bookBtn)
  bookBtn.addEventListener('click', e => {
    popUpCard.style.display='block';
    
    const { tourId } = e.target.dataset;
    
  //Se clicar fora do pop up, fecha-o
  window.onclick = function(e) {
    if (e.target == popUpCard) {
      popUpCard.style.display = "none";
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
  
const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20); 
