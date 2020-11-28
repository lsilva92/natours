import axios from 'axios';
import { showAlert } from './alerts';

export const manageTours = async (id, name, duration, price, maxGroupSize) => {
    try{
        const res= await axios({
            method: 'PATCH',
            url:`api/v1/backoffice/${id}`,
            data:{
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
        
    }catch(err){ 
        showAlert('error', err.response.data.message);
    }
}

export const manageUsers = async(id, user, email,role, active,retry) => {
    try{
        const res= await axios({
            method: 'PATCH',
            url:`api/v1/users/${id}`,
            data:{
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
    }catch(err){ 
        showAlert('error', err.response.data.message);
    }
    
}