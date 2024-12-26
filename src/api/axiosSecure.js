// src/api/axiosSecure.js

import axios from 'axios';

const axiosSecure = axios.create({
    baseURL: 'https://serve-sync-server.vercel.app',
    withCredentials: true
});

// response interceptor for handling auth errors
axiosSecure.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Redirect to login page or handle unauthorized access
            //window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosSecure;