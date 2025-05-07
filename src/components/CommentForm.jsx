'use client';

import { useState } from 'react';
import { createComment } from '@/services/commentService';

export default function CommentForm({ postId, onCommentCreated }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const newComment = await createComment(postId, { content });
      setContent('');
      if (onCommentCreated) onCommentCreated(newComment);
    } catch (error) {
      console.error('Failed to create comment:', error);
      setError('Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="mt-2 pl-12 border-t border-white/10 pt-3">
      <div className="flex gap-2">
        <div className="w-8 h-8 rounded-full bg-white/20 flex-shrink-0"></div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            className="w-full bg-transparent text-sm resize-none focus:outline-none placeholder:text-white/50 min-h-[40px]"
            maxLength={280}
            disabled={isSubmitting}
          />
          
          {error && <p className="text-red-400 text-xs mb-2">{error}</p>}
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              className="bg-primary text-white px-4 py-1 rounded-full text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Posting...' : 'Comment'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
} 