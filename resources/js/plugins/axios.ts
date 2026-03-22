import axios from 'axios';

const api = axios.create({
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Request interceptor to attach token
api.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Response interceptor to handle auth errors
api.interceptors.response.use(response => {
    return response;
}, error => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
        // Unauthenticated - clear token and notify
        localStorage.removeItem('access_token');
        // Only redirect if we are not already on a page that handles auth
        if (!window.location.pathname.startsWith('/admin')) {
             // Optional: window.location.href = '/login';
        }
    } else if (status === 403) {
        // Forbidden - authenticated but not authorized
        console.warn('Access forbidden: You do not have permission to perform this action.');
    }

    return Promise.reject(error);
});

export default api;
