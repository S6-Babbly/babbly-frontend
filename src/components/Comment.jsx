'use client';

import { useState } from 'react';
import { likeComment, deleteComment } from '@/services/commentService';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function Comment({ comment, onDelete }) {
  const { user } = useUser();
  const [likes, setLikes] = useState(comment.likes || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isAuthor = user && user.sub === comment.userId;

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      const response = await likeComment(comment.id);
      setLikes(response.likes);
    } catch (error) {
      console.error('Failed to like comment:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting || !isAuthor) return;
    
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    setIsDeleting(true);
    try {
      await deleteComment(comment.id);
      if (onDelete) onDelete(comment.id);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="pl-12 py-3 border-t border-white/10">
      <div className="flex gap-2">
        <div className="w-8 h-8 rounded-full bg-white/20 flex-shrink-0"></div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold hover:underline">User {comment.userId}</span>
            <span className="text-white/50 text-sm">@user{comment.userId}</span>
            <span className="text-white/50 text-sm">·</span>
            <span className="text-white/50 text-sm hover:underline">{comment.timeAgo || 'just now'}</span>
          </div>
          <p className="mt-1 text-sm leading-normal whitespace-pre-line">{comment.content}</p>
          
          <div className="flex items-center mt-2 text-white/50 gap-4">
            <button 
              className="group flex items-center gap-1 hover:text-red-400 text-xs"
              onClick={handleLike}
              disabled={isLiking}
            >
              <div className="p-1 rounded-full group-hover:bg-red-400/10">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span>{likes}</span>
            </button>
            
            {isAuthor && (
              <button 
                className="group flex items-center gap-1 hover:text-red-500 text-xs"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <div className="p-1 rounded-full group-hover:bg-red-500/10">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 