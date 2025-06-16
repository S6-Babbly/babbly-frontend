'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPost } from '@/services/postService';
import { useAuth } from '@/context/AuthContext';

export default function CreatePostPage() {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(0);
  const router = useRouter();
  const { isAuthenticated, getToken, isLoading } = useAuth();
  
  const MAX_CHARS = 280;
  
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    setCharCount(newContent.length);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Please log in to create a post');
      return;
    }
    
    if (!content.trim()) {
      setError('Post content cannot be empty');
      return;
    }
    
    if (charCount > MAX_CHARS) {
      setError(`Post content cannot exceed ${MAX_CHARS} characters`);
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const token = await getToken();
      if (!token) {
        setError('Unable to get authentication token. Please try logging in again.');
        return;
      }
      
      await createPost({ content: content.trim() }, token);
      router.push('/');
    } catch (error) {
      console.error('Error creating post:', error);
      
      // Handle specific backend error messages
      const errorMessage = error.message;
      
      if (errorMessage.includes('Authentication token not available') || 
          errorMessage.includes('Authentication required')) {
        setError('Please log in to create a post');
      } else if (errorMessage.includes('session has expired') || 
                 errorMessage.includes('401') || 
                 errorMessage.includes('Unauthorized')) {
        setError('Your session has expired. Please log in again');
      } else if (errorMessage.includes('Cannot create posts for other users') ||
                 errorMessage.includes('Insufficient permissions') ||
                 errorMessage.includes('403') || 
                 errorMessage.includes('Forbidden')) {
        setError('You do not have permission to create posts');
      } else if (errorMessage.includes('Post content cannot be empty') ||
                 errorMessage.includes('Post content cannot exceed')) {
        setError(errorMessage); // Show the exact backend validation message
      } else if (errorMessage.includes('400') || errorMessage.includes('Bad Request')) {
        setError('Invalid post content. Please check your input');
      } else {
        setError(`Failed to create post: ${errorMessage}`);
      }
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    router.back();
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="p-8 text-center">
        <p className="text-white/70 mb-4">Please log in to create a post</p>
        <button 
          onClick={() => window.location.href = '/api/auth/login'}
          className="bg-primary px-6 py-2 rounded-full font-bold hover:bg-primary/90 transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }
  
  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 backdrop-blur-md bg-secondary/80 border-b border-white/20 px-4 py-3 z-10">
        <div className="flex items-center">
          <button 
            onClick={handleCancel}
            className="mr-4 p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Create Post</h1>
        </div>
      </div>
      
      {/* Create Post Form */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-white/20"></div>
          <div className="flex-1">
            <textarea 
              className="w-full bg-transparent text-xl placeholder-white/50 border-none focus:ring-0 resize-none min-h-[200px]"
              placeholder="What's happening?"
              value={content}
              onChange={handleContentChange}
              disabled={isSubmitting}
              autoFocus
            ></textarea>
            
            {error && (
              <div className="text-red-400 text-sm mt-2">{error}</div>
            )}
            
            <div className="flex justify-between items-center mt-4 border-t border-white/20 pt-4">
              <div className="text-sm text-white/50">
                {charCount}/{MAX_CHARS}
              </div>
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 rounded-full font-bold border border-white/20 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
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
        </div>
      </form>
    </div>
  );
} 