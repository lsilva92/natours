/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const signUp = async data => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data
    });
    if (res.data.status === 'success') {
      showAlert('success', 'User created succesfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    if (err.response.data.error.code === 11000) {
      showAlert('error', 'This User account already exists');
    } else {
      showAlert('error', err.response.data.message);
    }
  }
};
