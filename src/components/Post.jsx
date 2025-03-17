'use client';

import { useState } from 'react';
import { likePost } from '@/services/postService';

export default function Post({ post }) {
  const [likes, setLikes] = useState(post.likes);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      const response = await likePost(post.id);
      setLikes(response.likes);
    } catch (error) {
      console.error('Failed to like post:', error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <article className="border-b border-white/20 p-4 hover:bg-white/5 transition-colors">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-full bg-white/20 flex-shrink-0"></div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold hover:underline">User {post.userId}</span>
            <span className="text-white/50">@user{post.userId}</span>
            <span className="text-white/50">·</span>
            <span className="text-white/50 hover:underline">{post.timeAgo}</span>
          </div>
          <p className="mt-2 text-[15px] leading-normal whitespace-pre-line">{post.content}</p>
          <div className="flex justify-between mt-4 max-w-md text-white/50">
            <button className="group flex items-center gap-2 hover:text-blue-400">
              <div className="p-2 rounded-full group-hover:bg-blue-400/10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="text-sm">0</span>
            </button>
            <button className="group flex items-center gap-2 hover:text-green-400">
              <div className="p-2 rounded-full group-hover:bg-green-400/10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <span className="text-sm">0</span>
            </button>
            <button 
              className="group flex items-center gap-2 hover:text-red-400"
              onClick={handleLike}
              disabled={isLiking}
            >
              <div className="p-2 rounded-full group-hover:bg-red-400/10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-sm">{likes}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
} 