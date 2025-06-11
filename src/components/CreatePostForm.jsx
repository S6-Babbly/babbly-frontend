'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createPost } from '@/services/postService';

export default function CreatePostForm({ onPostCreated }) {
  const { isAuthenticated, isLoading, auth0User, getToken, error: authError } = useAuth();
  
  // Always call hooks in the same order
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [charCount, setCharCount] = useState(0);
  
  const MAX_CHARS = 280;
  
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    setCharCount(newContent.length);
  };
  
  const handleLogin = () => {
    window.location.href = '/api/auth/login';
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check authentication before submitting
    if (!isAuthenticated) {
      setFormError('Please log in to create a post');
      return;
    }
    
    if (!content.trim()) {
      setFormError('Post content cannot be empty');
      return;
    }
    
    if (charCount > MAX_CHARS) {
      setFormError(`Post content cannot exceed ${MAX_CHARS} characters`);
      return;
    }
    
    setIsSubmitting(true);
    setFormError('');
    
    try {
      const token = await getToken();
      if (!token) {
        setFormError('Unable to get authentication token. Please try logging in again.');
        return;
      }
      
      const newPost = await createPost({ content: content.trim() }, token);
      setContent('');
      setCharCount(0);
      if (onPostCreated) {
        onPostCreated(newPost);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      
      // Handle specific backend error messages
      const errorMessage = error.message;
      
      if (errorMessage.includes('Authentication token not available') || 
          errorMessage.includes('Authentication required')) {
        setFormError('Please log in to create a post');
      } else if (errorMessage.includes('session has expired') || 
                 errorMessage.includes('401') || 
                 errorMessage.includes('Unauthorized')) {
        setFormError('Your session has expired. Please log in again');
      } else if (errorMessage.includes('Cannot create posts for other users') ||
                 errorMessage.includes('Insufficient permissions') ||
                 errorMessage.includes('403') || 
                 errorMessage.includes('Forbidden')) {
        setFormError('You do not have permission to create posts');
      } else if (errorMessage.includes('Post content cannot be empty') ||
                 errorMessage.includes('Post content cannot exceed')) {
        setFormError(errorMessage); // Show the exact backend validation message
      } else if (errorMessage.includes('400') || errorMessage.includes('Bad Request')) {
        setFormError('Invalid post content. Please check your input');
      } else {
        setFormError(`Failed to create post: ${errorMessage}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="border-b border-white/20 p-4">
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-3 text-white/70">Loading...</span>
        </div>
      </div>
    );
  }
  
  // Show error state if Auth0 has an error
  if (authError && authError !== 'Not authenticated') {
    return (
      <div className="border-b border-white/20 p-4">
        <div className="bg-red-400/10 rounded-lg p-4 text-center">
          <p className="text-red-400 mb-4">
            Authentication Error: {authError}
          </p>
          <button 
            onClick={handleLogin}
            className="bg-primary px-6 py-2 rounded-full font-bold hover:bg-primary/90 transition-colors"
          >
            Try Login Again
          </button>
        </div>
      </div>
    );
  }
  
  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="border-b border-white/20 p-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-white/20"></div>
          <div className="flex-1">
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <p className="text-white/70 mb-4">Sign in to share your thoughts with the world!</p>
              <button 
                onClick={handleLogin}
                className="bg-primary px-6 py-2 rounded-full font-bold hover:bg-primary/90 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Show post form for authenticated users
  return (
    <div className="border-b border-white/20 p-4">
      <form onSubmit={handleSubmit} className="space-y-0">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            {auth0User?.picture ? (
              <img 
                src={auth0User.picture} 
                alt={auth0User.name || 'User'} 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-primary flex items-center justify-center text-white font-bold">
                {(auth0User?.name || auth0User?.email || 'U').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1">
            <textarea 
              className="w-full bg-transparent text-xl placeholder-white/50 border-none focus:ring-0 resize-none min-h-[100px]"
              placeholder="What's happening?"
              value={content}
              onChange={handleContentChange}
              disabled={isSubmitting}
            ></textarea>
            
            {formError && (
              <div className="text-red-400 text-sm mt-2 p-2 bg-red-400/10 rounded">
                {formError}
                {(formError.includes('log in') || formError.includes('expired')) && (
                  <button 
                    onClick={handleLogin}
                    type="button"
                    className="ml-2 underline hover:no-underline"
                  >
                    Sign In
                  </button>
                )}
              </div>
            )}
            
            <div className="flex justify-between items-center mt-4 border-t border-white/20 pt-4">
              <div className="text-sm text-white/50">
                {charCount}/{MAX_CHARS}
              </div>
              <button 
                type="submit"
                disabled={isSubmitting || !content.trim() || charCount > MAX_CHARS}
                className="bg-primary px-6 py-2 rounded-full font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
} 