import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for HttpOnly cookies
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // We can handle 401 (Unauthorized) here globally if needed
    // ex: Redirect to login if 401 occurs on a protected route
    return Promise.reject(error);
  }
);

export default api;