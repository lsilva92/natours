/* eslint-disable */

/*Index.js purpose is to get data from user interface and delegate actions to the modules*/

import '@babel/polyfill';
import { elements } from './domElements';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { signUp } from './signUp';
import { bookTour } from './stripe';
import { showAlert } from './alerts';
import { createReview, editReview } from './review';
import { addLikeTour, deleteLikeTour } from './like';
import { manageTours, manageUsers, exportDoc, boDeleteOne } from './manageBO';
import {createTour} from './createTour';

//VALUES

//DELEGATION
if (elements.mapBox) {
  const locations = JSON.parse(elements.mapBox.dataset.locations);
  displayMap(locations);
}

if (elements.loginForm)
  elements.loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (elements.logOutBtn) elements.logOutBtn.addEventListener('click', logout);

if (elements.userPasswordForm)
  elements.userPasswordForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'data');
  });

if (elements.userPasswordForm)
  elements.userPasswordForm.addEventListener('submit', async e => {
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

if (elements.userSignUpForm)
  elements.userSignUpForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    signUp({ name, email, password, passwordConfirm });
  });
  


if(elements.newTourForm){
  var difficulty;
    
  for(let i = 0; i < elements.difficultyCheck.length; i++){
    elements.difficultyCheck[i].addEventListener('click', e => {
      difficulty = e.target.value
    });
  }
  elements.newTourForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('tour').value;
    const price = document.getElementById('price').value;
    const duration = document.getElementById('duration').value;
    const dates = document.getElementById('startdates').value;
    const maxGroupSize = document.getElementById('maxgroupsize').value;
    const location = document.getElementById('locations').value;
    const start = document.getElementById('startlocation').value;
    const summary = document.getElementById('summary').value;
    const description = document.getElementById('description').value;
    const imageCover = document.getElementById('photo').files[0].name;
    
    const startDates = [{date: dates}]
    
    const locations= [{description:location,type: 'Point',coordinates: [-106.855385, 39.182677]}];
    const startLocation = {description:start,type: 'Point', coordinates: [-106.855385, 39.182677]};
  
    createTour(name, price, duration,startDates, maxGroupSize, difficulty, locations,startLocation, summary, description, imageCover);
});
}

if(elements.editReviewForm)  
  elements.editReviewForm.addEventListener('submit', e=>{
    e.preventDefault();
    const { reviewId } = elements.reviewBtn.dataset;
    const review= document.getElementById('review').value;
    const ratings = []
    const stars = document.querySelector('.reviews__ratingpop').querySelectorAll('.reviews__star--active')
    
    for (let i= 0; i < stars.length; i++){
      ratings.push(stars[i].dataset.reviewId)
    }
    const rating = Math.max(...ratings)
    
    editReview(reviewId, review, rating)
  });



if (elements.bookBtn)
  elements.bookBtn.addEventListener('click', e => {
    elements.popUpCard.style.display='block';
    
    const { tourId } = e.target.dataset;
    
  //Se clicar fora do pop up, fecha-o
  window.onclick = function(e) {
    if (e.target == elements.popUpCard) {
      elements.popUpCard.style.display = 'none';
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
    item.addEventListener('click', e => {
    elements.reviewForm.style.display='block';
    
    window.onclick = function(e) {
      if (e.target == elements.reviewForm){
        elements.reviewForm.style.display = 'none'
      }
    }
  });
}

  
if(elements.addReview)
  reviewAddEdit(elements.addReview);

 
  if(elements.reviewStar)
    elements.reviewStar.addEventListener('click', e => {
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
    
if (elements.reviewFormSub)
    elements.reviewFormSub.addEventListener('submit', e => {
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
  
if(elements.likeTour)
  elements.likeTour.addEventListener('click', e => {
    const like = document.querySelector('.like__icon').classList.toggle('liked');
    
    const tourId = document.querySelector('.like__icon').dataset.tourId;
    
    if(like){
      addLikeTour(tourId);
    }else{
      deleteLikeTour(tourId);
    }
  })
  
//BackOffice  
if(elements.table){
  //edit button
  for(let i = 0; i < elements.editTable.length; i++){
    elements.editTable[i].addEventListener('click', e => {
      const editContent = elements.editTable[i].closest('tr').querySelectorAll('.tcontent');
      for(let x= 0; x < editContent.length; x++){
        if(editContent[x].id !== 'role' && editContent[x].id !=='active'){
          editContent[x].style.fontWeight ='bold';
          editContent[x].contentEdielements.table='true';   
        }
      }
    
      const select = elements.editTable[i].closest('tr').querySelectorAll('select')
      for(let y = 0; y < select.length; y++){
        select[y].style.fontWeight ='bold';
        select[y].disabled=false;
      } 
      
      elements.editTable[i].classList.toggle('hide');
      elements.elements.tableBtn[i].classList.toggle('show');
      elements.deleteBtn[i].classList.toggle('hide');
    });
  };
  
  //cancel button
  for(let i= 0; i < elements.editTable.length; i++){
    elements.cancelBtn[i].addEventListener('click', e => {
    const editContent = elements.editTable[i].closest('tr').querySelectorAll('.tcontent');
      for(let x= 0; x < editContent.length; x++){
        editContent[x].style.fontWeight ='normal';
        editContent[x].contentEdielements.table='false';
    }
    
    const select = elements.editTable[i].closest('tr').querySelectorAll('select')
      for(let y = 0; y < select.length; y++){
        select[y].style.fontWeight ='normal';
        select[y].disabled=true;
      } 
    
    elements.elements.tableBtn[i].classList.toggle('show')
    elements.editTable[i].classList.toggle('hide');
    elements.deleteBtn[i].classList.toggle('hide');
    })
  }
  //save button 
  for(let i= 0; i < elements.editTable.length ; i++){
    elements.saveBtn[i].addEventListener('click',e => {
      if(elements.tourTable){
        const {id}  = elements.editTable[i].closest('tr').dataset;
        const rows = elements.editTable[i].closest('tr').querySelectorAll('.tcontent');
        const tourName = rows[0].innerHTML;
        const tourDuration = rows[1].innerHTML;
        const tourPrice= rows[2].innerHTML;
        const tourGroupSize= rows[3].innerHTML;
        manageTours(id, tourName, tourDuration, tourPrice,tourGroupSize);
      }else if (elements.userTable){
        const {id}  = elements.editTable[i].closest('tr').dataset;
        const rows = elements.editTable[i].closest('tr').querySelectorAll('.tcontent');
        const selectActive = rows[3].getElementsByTagName('select');
        const selectRole = rows[2].getElementsByTagName('select');
        
        const user = rows[0].innerHTML;
        const email = rows[1].innerHTML;
        const role = selectRole[0].options[selectRole[0].selectedIndex].text;
        const active = selectActive[0].options[selectActive[0].selectedIndex].text;
        const retry = rows[4].innerHTML;
        
        manageUsers(id, user, email,role, active,retry)
      }
    });
  };
  
  
  //delete Button
  for (let i = 0; i < elements.deleteBtn.length; i++){
    elements.deleteBtn[i].addEventListener('click', e => {
      if(elements.tourTable){
        const {id}  = elements.editTable[i].closest('tr').dataset;
        elements.popUpCard.style.display='block';
        
        elements.confirmNo.addEventListener('click', e => {
          elements.popUpCard.style.display = 'none'
        });
        
        elements.confirmYes.addEventListener('click', e => {
          boDeleteOne(id, 'tour');
        });
            
        //boDeleteOne(id, 'tour');
      }else if(elements.userTable){
        const {id}  = elements.editTable[i].closest('tr').dataset;
        elements.popUpCard.style.display='block';
        
        elements.confirmNo.addEventListener('click', e => {
          elements.popUpCard.style.display = 'none'
        });
        
        elements.confirmYes.addEventListener('click', e => {
          boDeleteOne(id, 'user');
        });
      }
  }
    )}
}
    
if(elements.exportTourBtn)
  elements.exportTourBtn.addEventListener('click', e => exportDoc('tours'));

if(elements.exportUserBtn)
  elements.exportUserBtn.addEventListener('click', e => exportDoc('users'));

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20); 
