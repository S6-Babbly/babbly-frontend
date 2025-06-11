/**
 * Utility functions for handling and formatting error messages
 */

/**
 * Format error messages from backend API responses
 * @param {Error} error - The error object from catch block
 * @returns {string} - Formatted error message for display
 */
export const formatErrorMessage = (error) => {
  const errorMessage = error.message || 'An unexpected error occurred';
  
  // Authentication errors
  if (errorMessage.includes('Authentication token not available') || 
      errorMessage.includes('Authentication required')) {
    return 'Please log in to continue';
  }
  
  if (errorMessage.includes('session has expired') || 
      errorMessage.includes('401') || 
      errorMessage.includes('Unauthorized')) {
    return 'Your session has expired. Please log in again';
  }
  
  // Authorization errors
  if (errorMessage.includes('Cannot create posts for other users') ||
      errorMessage.includes('Can only update your own posts') ||
      errorMessage.includes('Can only delete your own posts') ||
      errorMessage.includes('Insufficient permissions') ||
      errorMessage.includes('403') || 
      errorMessage.includes('Forbidden')) {
    return 'You do not have permission to perform this action';
  }
  
  // Validation errors - return exact message from backend
  if (errorMessage.includes('Post content cannot be empty') ||
      errorMessage.includes('Post content cannot exceed') ||
      errorMessage.includes('Content must be between')) {
    return errorMessage;
  }
  
  // Generic validation errors
  if (errorMessage.includes('400') || errorMessage.includes('Bad Request')) {
    return 'Invalid input. Please check your data and try again';
  }
  
  // Server errors
  if (errorMessage.includes('500') || errorMessage.includes('Internal server error')) {
    return 'Server error. Please try again later';
  }
  
  // Network errors
  if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
    return 'Network error. Please check your connection and try again';
  }
  
  // Return original message if no specific handling
  return errorMessage;
};

/**
 * Check if an error should trigger a login redirect
 * @param {Error} error - The error object from catch block
 * @returns {boolean} - True if should redirect to login
 */
export const shouldRedirectToLogin = (error) => {
  const errorMessage = error.message || '';
  
  return errorMessage.includes('Authentication token not available') ||
         errorMessage.includes('Authentication required') ||
         errorMessage.includes('session has expired') ||
         errorMessage.includes('401') ||
         errorMessage.includes('Unauthorized');
};

/**
 * Check if an error is a validation error
 * @param {Error} error - The error object from catch block
 * @returns {boolean} - True if it's a validation error
 */
export const isValidationError = (error) => {
  const errorMessage = error.message || '';
  
  return errorMessage.includes('Post content cannot') ||
         errorMessage.includes('Content must be between') ||
         errorMessage.includes('400') ||
         errorMessage.includes('Bad Request');
};

/**
 * Get error type for styling purposes
 * @param {Error} error - The error object from catch block
 * @returns {string} - Error type: 'auth', 'validation', 'permission', 'server', 'network', 'generic'
 */
export const getErrorType = (error) => {
  const errorMessage = error.message || '';
  
  if (shouldRedirectToLogin(error)) {
    return 'auth';
  }
  
  if (isValidationError(error)) {
    return 'validation';
  }
  
  if (errorMessage.includes('403') || errorMessage.includes('Forbidden') || 
      errorMessage.includes('permission')) {
    return 'permission';
  }
  
  if (errorMessage.includes('500') || errorMessage.includes('Internal server error')) {
    return 'server';
  }
  
  if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
    return 'network';
  }
  
  return 'generic';
}; 