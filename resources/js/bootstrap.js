import axios from 'axios';

window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
// window.axios.defaults.baseURL = '/api';

// Interceptor to attach token
window.axios.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Interceptor to handle 401 errors
window.axios.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response && error.response.status === 401) {
        // Clear token and redirect to login if needed
        localStorage.removeItem('access_token');
        // Optional: window.location.href = '/login'; 
    }
    return Promise.reject(error);
});

const existingToken = window.localStorage.getItem('access_token');

if (existingToken) {
    window.axios.defaults.headers.common[
        'Authorization'
    ] = `Bearer ${existingToken}`;
}
