import axios from 'axios';

const refreshToken = async () => {
    try {
        const response = await axios.get('http://localhost:8000/refresh', { withCredentials: true });
        localStorage.setItem('access_token', response.data.access_token); 
    } catch (error) {
        console.error('Ошибка обновления токена:', error);
    }
};
