import axios from 'axios';
import { showAlert } from './alerts';

export const createReview = async(tour, review, rating) => {
try{
    const res= await axios({
        method: 'POST',
        url:'/api/v1/reviews',
        data:{
            tour,
            review,
            rating
        }
    })

    if (res.data.status === 'success') {
        showAlert('success', `Review created succesfully!!!`);
        setTimeout(() => {
          location.reload(true), 3000;
        });
      }
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
}