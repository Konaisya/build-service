import axios from 'axios';
import { API_AUTH_URL } from '@/config/apiConfig';

export interface LoginResponse {
    access_token: string;
  }
  

export const login = async(email: string, password: string): Promise<LoginResponse> => {
    const params = new URLSearchParams();
    params.append('email', email);
    params.append('password', password);
    const response = await axios.post(API_AUTH_URL + "login", params, {
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    
    if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
    }

    return response.data;
};
