import API from './client.js';

export const login = async (email: string, password: string) => {
  const response = await API.post('/users/login', { email, password });
  if (response.data.status === 'success' && response.data.token) {
    localStorage.setItem('edubuddy_token', response.data.token);
    localStorage.setItem('edubuddy_user', JSON.stringify(response.data.data));
  }
  return response.data;
};

// NEW: Signup/Register Service Hook
export const signup = async (userData: {
  school_id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: 'teacher' | 'admin';
}) => {
  const response = await API.post('/users', userData);
  if (response.data.status === 'success' && response.data.token) {
    localStorage.setItem('edubuddy_token', response.data.token);
    localStorage.setItem('edubuddy_user', JSON.stringify(response.data.data));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('edubuddy_token');
  localStorage.removeItem('edubuddy_user');
  window.location.href = '/login';
};