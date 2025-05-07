'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import Post from './Post';
import { SWR_KEYS } from '@/lib/swr';

const PostFeed = forwardRef((props, ref) => {
  const [error, setError] = useState('');
  const pageSize = 10;

  // Define the key generator for infinite loading
  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.items?.length) return null; // reached the end
    return `${SWR_KEYS.FEED}?page=${pageIndex + 1}&pageSize=${pageSize}`;
  };

  // Use SWR infinite for pagination
  const { data, error: swrError, size, setSize, mutate, isLoading, isValidating } = useSWRInfinite(getKey);

  // Flatten all pages of posts
  const posts = data ? [].concat(...data.map(page => page.items || [])) : [];
  const isEmpty = data?.[0]?.items?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.items?.length < pageSize);
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined');

  // For error handling
  if (swrError && !error) {
    setError('Failed to load posts. Please try again later.');
  }

  // Expose the refreshPosts method to parent components
  useImperativeHandle(ref, () => ({
    refreshPosts: () => mutate()
  }));

  const handleLoadMore = () => {
    if (!isLoadingMore && !isReachingEnd) {
      setSize(size + 1);
    }
  };

  if (isLoading && !posts.length) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button 
          onClick={() => mutate()}
          className="bg-primary px-4 py-2 rounded-full text-sm font-bold hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="p-8 text-center">
        <p className="text-white/70">No posts yet. Be the first to post!</p>
      </div>
    );
  }

  return (
    <div>
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
      
      <div className="p-4 text-center">
        {!isReachingEnd ? (
          <button 
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="bg-white/10 hover:bg-white/20 transition-colors text-white px-4 py-2 rounded-full text-sm"
          >
            {isLoadingMore ? 'Loading...' : 'Load More Posts'}
          </button>
        ) : (
          <p className="text-white/50 text-sm">No more posts to load</p>
        )}
      </div>
    </div>
  );
});

PostFeed.displayName = 'PostFeed';

export default PostFeed; 