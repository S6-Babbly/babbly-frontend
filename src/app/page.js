'use client';

import { useState, useRef } from 'react';
import CreatePostForm from '@/components/CreatePostForm';
import PostFeed from '@/components/PostFeed';

// Metadata is declared in layout.js and individual page metadata for client components
// should be handled differently

export default function Home() {
  const postFeedRef = useRef(null);

  const handlePostCreated = (newPost) => {
    // Refresh the post feed when a new post is created
    if (postFeedRef.current) {
      postFeedRef.current.refreshPosts();
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 backdrop-blur-md bg-secondary/80 border-b border-white/20 px-4 py-3 z-10">
        <h1 className="text-xl font-bold">Home</h1>
      </div>

      {/* Create Post */}
      <CreatePostForm onPostCreated={handlePostCreated} />

      {/* Posts Feed */}
      <PostFeed ref={postFeedRef} />
    </div>
  );
}
