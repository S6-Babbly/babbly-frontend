import axios from 'axios';

// Use the external API Gateway directly - no rewrites needed
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5010';

/**
 * Create an axios instance for API calls
 * For DEMO MODE: tokens are optional, backend doesn't require auth
 */
export const createApiClient = (token = null) => {
  const headers = {};
  
  // For demo mode: token is optional, backend handles requests without auth
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return axios.create({
    baseURL: API_URL,
    headers,
    timeout: 10000, // 10 seconds
  });
};

/**
 * Make an API request (demo mode: no authentication required)
 * @param {string} url - The URL to call
 * @param {string} method - HTTP method (get, post, put, delete)
 * @param {object} data - Request body for POST/PUT calls
 * @param {string} token - Auth token (optional for demo)
 */
export const apiRequest = async (url, method = 'get', data = null, token = null) => {
  try {
    const api = createApiClient(token);
    
    const config = {
      url,
      method,
    };
    
    if (data && (method.toLowerCase() === 'post' || method.toLowerCase() === 'put')) {
      config.data = data;
    }
    
    const response = await api.request(config);
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
      
      // For demo mode: reduce auth-related errors
      if (status === 401) {
        console.warn('Demo mode: API call made without auth, but backend should allow it');
        throw new Error('Demo mode: Request failed, but auth is optional');
      }
      
      if (status === 403) {
        console.warn('Demo mode: Permission denied, but should work without auth');
        throw new Error('Demo mode: Permission denied');
      }
      
      throw new Error(data.error || 'An error occurred while making the request');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response received from the server. Please try again.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw error;
    }
  }
};

// Create a base Axios instance 
const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Response interceptor to handle common errors (demo mode: less strict)
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle rate limiting
    if (error.response?.status === 429) {
      console.warn('Rate limit hit. Please try again later.');
    }
    
    // For demo mode: don't redirect on auth errors, just log them
    if (error.response?.status === 401) {
      console.warn('Demo mode: Got 401 but not redirecting to login');
    }
    
    return Promise.reject(error);
  }
);

// Helper methods for common API operations (demo mode: tokens optional)
export const apiClient = {
  get: async (url, token = null, config = {}) => {
    try {
      const api = createApiClient(token);
      const response = await api.get(url, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  post: async (url, data = {}, token = null, config = {}) => {
    try {
      const api = createApiClient(token);
      const response = await api.post(url, data, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  put: async (url, data = {}, token = null, config = {}) => {
    try {
      const api = createApiClient(token);
      const response = await api.put(url, data, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  delete: async (url, token = null, config = {}) => {
    try {
      const api = createApiClient(token);
      const response = await api.delete(url, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};

// Centralized error handling (demo mode: more lenient)
const handleApiError = (error) => {
  // Log errors to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('API Error:', error.response?.data || error.message);
  }
  
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
        errorMessage = 'Demo mode: Auth optional, but request failed';
        break;
      case 403:
        errorMessage = 'Demo mode: Permission issue, but should work without auth';
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