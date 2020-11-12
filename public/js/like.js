import axios from 'axios';
import { showAlert } from './alerts';

export const addLikeTour = async tour => {
    try{
        const res = await axios({
            method:'POST',
            url:'/api/v1/users/likeTour',
            data: {
               id: tour
            }
        });
        
        if(res.data.status === 'success'){
            showAlert('success','Tour added to Favorites!')
        }
    }catch(err){ 
        showAlert('error', err.response.data.message);
    }
}

export const deleteLikeTour = async tour => {
    try{
        await axios({
            method:'DELETE',
            url:'/api/v1/users/likeTour',
            data: {
               id: tour
            }
        });
    }catch(err){ 
        showAlert('error', err.response.data.message);
    }
}