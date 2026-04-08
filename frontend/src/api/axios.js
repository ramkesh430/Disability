import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      console.error('Network connection failed. Please check if the backend server is running.');
      error.message = 'Unable to connect to server. Please ensure the backend is running on http://127.0.0.1:8000';
    } else if (error.response?.status === 401) {
      console.error('Authentication failed. Please log in again.');
      // Clear invalid token
      localStorage.removeItem("token");
      // You might want to redirect to login page here
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      console.error('Access forbidden. You don\'t have permission to access this resource.');
      error.message = 'Access denied. Please check your permissions.';
    } else if (error.response?.status === 422) {
      console.error('Validation error:', error.response.data?.detail || 'Invalid request data');
      error.message = error.response.data?.detail || 'Validation failed. Please check your input.';
    } else if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data?.detail || 'Internal server error');
      error.message = 'Server error occurred. Please try again later.';
    }
    return Promise.reject(error);
  }
);

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

// Helper function to get current user info from token
export const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Invalid token format');
    return null;
  }
};

export default api;
