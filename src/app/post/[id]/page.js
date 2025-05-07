'use client';

import { useState, useEffect } from 'react';
import { getPostById } from '@/services/postService';
import Post from '@/components/Post';
import CommentSection from '@/components/CommentSection';

export default function PostPage({ params }) {
  const { id } = params;
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const postData = await getPostById(id);
        setPost(postData);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load the post. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="p-8 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary px-4 py-2 rounded-full text-sm font-bold hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-4">
        <div className="p-8 text-center">
          <p className="text-white/70">Post not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="border-b border-white/20 pb-2 mb-4">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back</span>
        </button>
      </div>
      
      <Post post={post} />
      
      <div className="mt-4">
        <CommentSection postId={id} />
      </div>
    </div>
  );
} 