import axios from 'axios';

// Create a centralized axios instance
const api = axios.create({
  baseURL: 'https://localhost:5000/api',
  withCredentials: true, // Send cookies with requests
});

// Interceptor to fetch and set CSRF token
api.interceptors.request.use(async (config) => {

  // Only add CSRF token to state-changing methods
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(config.method.toUpperCase())) {
    try {
      // Fetch the fresh CSRF token from the backend
      const { data } = await axios.get('https://localhost:5000/api/csrf-token', { withCredentials: true });

      // Set the 'X-CSRF-TOKEN' header
      config.headers['X-CSRF-TOKEN'] = data.csrfToken;

    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
      // Optionally, you could prevent the request from being sent
      return Promise.reject('CSRF token fetch failed.');
    }
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Also include the token from localStorage for authorization
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
