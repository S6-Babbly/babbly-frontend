import axios from 'axios';

// Create the Axios instance with default config
const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor to add the auth token
API.interceptors.request.use(
  async (config) => {
    // We don't manually get the token because Auth0 Next.js SDK
    // will handle this automatically with cookies
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle rate limiting
    if (error.response?.status === 429) {
      console.warn('Rate limit hit. Please try again later.');
    }
    
    // Handle authentication errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Auth0 should handle token refresh automatically
      // But we can redirect to login if needed
      if (typeof window !== 'undefined') {
        window.location.href = '/api/auth/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper methods for common API operations
export const apiClient = {
  get: async (url, config = {}) => {
    try {
      const response = await API.get(url, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  post: async (url, data = {}, config = {}) => {
    try {
      const response = await API.post(url, data, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  put: async (url, data = {}, config = {}) => {
    try {
      const response = await API.put(url, data, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  delete: async (url, config = {}) => {
    try {
      const response = await API.delete(url, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};

// Centralized error handling
const handleApiError = (error) => {
  // Log errors to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('API Error:', error.response?.data || error.message);
  }
  
  // You could integrate with an error tracking service here
  
  // Format the error message for UI display
  let errorMessage = 'An unexpected error occurred';
  
  if (error.response) {
    // Server responded with an error
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        errorMessage = data.message || 'Invalid request';
        break;
      case 401:
        errorMessage = 'You need to log in again';
        break;
      case 403:
        errorMessage = 'You do not have permission to access this resource';
        break;
      case 404:
        errorMessage = 'The requested resource was not found';
        break;
      case 429:
        errorMessage = 'Too many requests. Please try again later';
        break;
      case 500:
        errorMessage = 'Server error. Please try again later';
        break;
      default:
        errorMessage = data.message || `Error ${status}: Something went wrong`;
    }
  } else if (error.request) {
    // Request was made but no response received
    errorMessage = 'No response from server. Please check your connection';
  }
  
  error.displayMessage = errorMessage;
};

export default API; 