import axios from "axios";

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token;
  }
  if (userId) {
    config.headers['X-User-Id'] = userId;
  }
  return config;
});

// Add 'token' as a parameter and pass it into the headers!
export const getActivities = (token) => api.get('/activities', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

// Add 'token' as the second parameter and pass it into the headers
export const addActivity = (activity, token) => api.post('/activities', activity, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

// FIX 1: Spelled "activity" correctly!
// FIX 2: Added 'token' as a parameter and forced it into the headers!
export const getActivityDetail = (id, token) => api.get(`/recommendations/activity/${id}`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});