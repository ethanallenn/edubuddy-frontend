import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject the JWT token into headers if it exists in browser memory
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('edubuddy_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;