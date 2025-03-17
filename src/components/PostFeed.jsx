'use client';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import Post from './Post';
import { getAllPosts } from '@/services/postService';

const PostFeed = forwardRef((props, ref) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const fetchedPosts = await getAllPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Expose the refreshPosts method to parent components
  useImperativeHandle(ref, () => ({
    refreshPosts: fetchPosts
  }));

  const handlePostCreated = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  if (isLoading) {
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
          onClick={fetchPosts}
          className="bg-primary px-4 py-2 rounded-full text-sm font-bold hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
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
    </div>
  );
});

PostFeed.displayName = 'PostFeed';

export default PostFeed; 