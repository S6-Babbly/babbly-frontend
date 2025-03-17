'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPost } from '@/services/postService';

export default function CreatePostPage() {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(0);
  const router = useRouter();
  
  const MAX_CHARS = 280;
  
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    setCharCount(newContent.length);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Post content cannot be empty');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await createPost(content);
      router.push('/');
    } catch (error) {
      setError('Failed to create post. Please try again.');
      console.error('Error creating post:', error);
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    router.back();
  };
  
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