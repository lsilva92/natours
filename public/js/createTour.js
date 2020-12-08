import axios from 'axios';
import { showAlert } from './alerts';

export const createTour = async (name, price, duration, startDates, maxGroupSize, difficulty,locations,startLocation,summary, description, imageCover) => {
    try{
        const res = await axios({
            method: 'POST',
            url:'api/v1/tours', 
            data:{
                name,
                price,
                duration,
                startDates,
                maxGroupSize, 
                difficulty, 
                locations,
                startLocation,
                summary, 
                description, 
                imageCover
            }
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Tour created succesfully!');
            window.setTimeout(() => {
            location.assign('/');
            }, 1500);
        }
    }catch (err) {
        showAlert('error', err.response.data.message);
    }
}