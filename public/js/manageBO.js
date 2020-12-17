/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const manageTours = async (id, name, duration, price, maxGroupSize) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `api/v1/backoffice/${id}`,
      data: {
        name,
        duration,
        price,
        maxGroupSize
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Data updated succesfully!!');
      window.setTimeout(() => {
        location.assign('/manageTours');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const manageUsers = async (id, user, email, role, active, retry) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `api/v1/users/${id}`,
      data: {
        user,
        email,
        role,
        active,
        retry
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Data updated succesfully!!');
      window.setTimeout(() => {
        location.assign('/manageUsers');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const exportDoc = async col => {
  try {
    if (col === 'tours') {
      const res = await axios({
        method: 'GET',
        url: 'api/v1/backoffice/export/tours'
      });

      if (res.data.status === 'success') {
        showAlert('success', 'Export concluded succesfully!!');
        window.setTimeout(() => {
          location.assign('/manageTours');
        }, 1500);
      }
    } else if (col === 'users') {
      const res = await axios({
        method: 'GET',
        url: 'api/v1/backoffice/export/users'
      });

      if (res.data.status === 'success') {
        showAlert('success', 'Export concluded succesfully!!');
        window.setTimeout(() => {
          location.assign('/manageUsers');
        }, 1500);
      }
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const boDeleteOne = async (id, doc) => {
  try{
    if (doc === 'tour') {
      await axios({
        method: 'GET',
        url: `api/v1/tours/${id}/reviews`
      })
        .then(resReviews => {
          const idReviews = resReviews.data.data.data.map(el => el._id);

          for (let i = 0; i < idReviews.length; i++) {
            axios({
              method: 'DELETE',
              url: `api/v1/reviews/${idReviews[i]}`
            });
          }
        })
        .then(() => {
          axios({
            method: 'DELETE',
            url: `api/v1/tours/${id}`
          }).then(resTours => {
            if (resTours.status === 204) {
              showAlert('success', 'Tour deleted succesfully!!');
              window.setTimeout(() => {
                location.assign('/manageTours');
              }, 1500);
            }
          });
        });
    } else if (doc === 'user') {
       await axios({
            method: 'DELETE',
            url: `api/v1/users/${id}`
          }).then(resUsers => {
            if (resUsers.status === 204) {
              axios({
                method: 'GET',
                url: `api/v1/users/${id}/reviews`
              }).then(resReviews => {
                const idReviews = resReviews.data.data.data.map(el => el._id);
        
                for (let i = 0; i < idReviews.length; i++) {
                  axios({
                    method: 'DELETE',
                    url: `api/v1/reviews/${idReviews[i]}`
                  })
             }
          });
          showAlert('success', 'User deleted succesfully!!');
            window.setTimeout(() => {
              location.assign('/manageUsers');
            }, 1500);
    }
  })
    }    
  }catch (err) {
    showAlert('error', err.response.data.message);
  }
}