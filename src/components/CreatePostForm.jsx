'use client';

import { useState } from 'react';
import { createPost } from '@/services/postService';

export default function CreatePostForm({ onPostCreated }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(0);
  
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
      const newPost = await createPost(content);
      setContent('');
      setCharCount(0);
      if (onPostCreated) {
        onPostCreated(newPost);
      }
    } catch (error) {
      setError('Failed to create post. Please try again.');
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="border-b border-white/20 p-4">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-full bg-white/20"></div>
        <div className="flex-1">
          <textarea 
            className="w-full bg-transparent text-xl placeholder-white/50 border-none focus:ring-0 resize-none min-h-[100px]"
            placeholder="What's happening?"
            value={content}
            onChange={handleContentChange}
            disabled={isSubmitting}
          ></textarea>
          
          {error && (
            <div className="text-red-400 text-sm mt-2">{error}</div>
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
  );
} 