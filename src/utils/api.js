import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

// Automatically attach JWT from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vitalsync_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If backend returns 401, clear storage and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('vitalsync_token');
      localStorage.removeItem('vitalsync_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
