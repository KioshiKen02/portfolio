import axios from 'axios';

window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.baseURL = '/api';

const existingToken = window.localStorage.getItem('access_token');

if (existingToken) {
    window.axios.defaults.headers.common[
        'Authorization'
    ] = `Bearer ${existingToken}`;
}
