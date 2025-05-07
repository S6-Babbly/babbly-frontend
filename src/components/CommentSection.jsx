'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Comment from './Comment';
import CommentForm from './CommentForm';
import { useUser } from '@auth0/nextjs-auth0/client';
import { SWR_KEYS } from '@/lib/swr';

export default function CommentSection({ postId, onCommentCountChange }) {
  const { user } = useUser();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  
  // Use SWR to fetch comments
  const { data, error, mutate, isLoading } = useSWR(
    `${SWR_KEYS.COMMENTS(postId)}?page=${page}&pageSize=${pageSize}`
  );
  
  const comments = data?.items || [];
  const hasMore = comments.length === pageSize;
  
  // Update comment count in parent component if needed
  if (onCommentCountChange && data?.total !== undefined) {
    onCommentCountChange(data.total);
  }

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
  };

  const handleCommentCreated = (newComment) => {
    // Optimistically update the UI
    const updatedComments = [newComment, ...comments];
    const updatedTotal = (data?.total || 0) + 1;
    
    // Update the local cache
    mutate({
      items: updatedComments,
      total: updatedTotal
    }, false);
    
    // Revalidate from the server
    mutate();
    
    // Update comment count in parent
    if (onCommentCountChange) {
      onCommentCountChange(updatedTotal);
    }
  };

  const handleCommentDeleted = (commentId) => {
    // Optimistically update the UI
    const updatedComments = comments.filter(comment => comment.id !== commentId);
    const updatedTotal = (data?.total || 0) - 1;
    
    // Update the local cache
    mutate({
      items: updatedComments,
      total: updatedTotal
    }, false);
    
    // Revalidate from the server
    mutate();
    
    // Update comment count in parent
    if (onCommentCountChange) {
      onCommentCountChange(updatedTotal);
    }
  };

  return (
    <div className="mt-2">
      <h3 className="font-bold text-sm px-4 py-2 border-t border-white/20">
        Comments ({data?.total || 0})
      </h3>
      
      {user && (
        <CommentForm postId={postId} onCommentCreated={handleCommentCreated} />
      )}

      {comments.length > 0 ? (
        <div className="mt-2">
          {comments.map(comment => (
            <Comment 
              key={comment.id} 
              comment={comment} 
              onDelete={handleCommentDeleted} 
            />
          ))}
          
          {hasMore && (
            <div className="py-3 text-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="text-primary hover:underline text-sm"
              >
                {isLoading ? 'Loading...' : 'Load more comments'}
              </button>
            </div>
          )}
        </div>
      ) : isLoading ? (
        <div className="py-3 text-center text-white/50 text-sm">
          Loading comments...
        </div>
      ) : error ? (
        <div className="py-3 text-center text-red-400 text-sm">
          Failed to load comments. Please try again.
          <button 
            className="block mx-auto mt-2 text-primary hover:underline text-sm"
            onClick={() => mutate()}
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="py-3 text-center text-white/50 text-sm">
          No comments yet. {user ? 'Be the first to comment!' : 'Log in to comment.'}
        </div>
      )}
    </div>
  );
} 