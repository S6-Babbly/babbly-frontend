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
      // DEMO MODE: Try to get token but proceed without it if unavailable
      let token = null;
      try {
        if (isAuthenticated) {
          token = await getToken();
        }
      } catch (tokenError) {
        console.log('Demo mode: Proceeding without token');
      }
      
      // For demo mode: include a demo userId if not authenticated
      const postData = {
        content: content.trim()
      };
      
      if (!isAuthenticated) {
        postData.userId = 'demo-user-1'; // Default demo user
      }
      
      const newPost = await createPost(postData, token);
      setContent('');
      setCharCount(0);
      if (onPostCreated) {
        onPostCreated(newPost);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      
      // Handle specific backend error messages
      const errorMessage = error.message;
      
      if (errorMessage.includes('Post content cannot be empty') ||
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
  
  // Show error state if Auth0 has an error (but still allow posting in demo mode)
  if (authError && authError !== 'Not authenticated') {
    console.warn('Demo mode: Auth error but allowing posting anyway:', authError);
  }
  
  // Get user display info (Auth0 user if authenticated, demo user if not)
  const displayUser = isAuthenticated ? auth0User : {
    name: 'Demo User',
    picture: null,
    email: 'demo@example.com'
  };
  
  // Show post form (always available in demo mode)
  return (
    <div className="border-b border-white/20 p-4">
      {/* Optional login prompt for visual purposes */}
      {!isAuthenticated && (
        <div className="bg-blue-500/10 rounded-lg p-3 mb-4 text-center">
          <p className="text-blue-400 text-sm mb-2">Demo Mode: You can post without logging in, or</p>
          <button 
            onClick={handleLogin}
            className="bg-primary px-4 py-1 rounded-full text-sm font-bold hover:bg-primary/90 transition-colors"
          >
            Sign In with Auth0
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-0">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            {displayUser?.picture ? (
              <img 
                src={displayUser.picture} 
                alt={displayUser.name || 'User'} 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-primary flex items-center justify-center text-white font-bold">
                {(displayUser?.name || displayUser?.email || 'U').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1">
            <textarea 
              className="w-full bg-transparent text-xl placeholder-white/50 border-none focus:ring-0 resize-none min-h-[100px]"
              placeholder={isAuthenticated ? "What's happening?" : "What's happening? (Demo Mode)"}
              value={content}
              onChange={handleContentChange}
              disabled={isSubmitting}
            ></textarea>
            
            {formError && (
              <div className="text-red-400 text-sm mt-2 p-2 bg-red-400/10 rounded">
                {formError}
              </div>
            )}
            
            <div className="flex justify-between items-center mt-4 border-t border-white/20 pt-4">
              <div className="text-sm text-white/50">
                {charCount}/{MAX_CHARS}
                {!isAuthenticated && <span className="ml-2 text-blue-400">(Demo Mode)</span>}
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