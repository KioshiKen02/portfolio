import axios from 'axios';

window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.baseURL = '/api';

// Interceptor to attach token
window.axios.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const existingToken = window.localStorage.getItem('access_token');

if (existingToken) {
    window.axios.defaults.headers.common[
        'Authorization'
    ] = `Bearer ${existingToken}`;
}
