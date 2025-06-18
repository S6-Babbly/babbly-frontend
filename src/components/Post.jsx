'use client';

import { useState } from 'react';
import { likePost, updatePost, deletePost } from '@/services/postService';
import { useAuth } from '@/context/AuthContext';
import CommentSection from './CommentSection';
import Link from 'next/link';

export default function Post({ post, onPostUpdated, onPostDeleted }) {
  const { auth0User } = useAuth();
  const [likes, setLikes] = useState(post.likes);
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  
  const isOwner = auth0User && auth0User.sub === post.userId;

  const handleLike = async () => {
    if (isLiking) return;
    
    // Check if user is authenticated
    if (!auth0User) {
      console.error('Must be logged in to like posts');
      return;
    }
    
    setIsLiking(true);
    try {
      // Get authentication token
      const token = await fetch('/api/auth/token');
      const tokenData = await token.json();
      
      if (!tokenData.accessToken) {
        throw new Error('Authentication token not available');
      }
      
      const response = await likePost(post.id, tokenData.accessToken);
      setLikes(response.likes);
    } catch (error) {
      console.error('Failed to like post:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleUpdate = async () => {
    if (!editContent.trim()) {
      setError('Post content cannot be empty');
      return;
    }
    
    if (editContent.length > 280) {
      setError('Post content cannot exceed 280 characters');
      return;
    }
    
    setIsUpdating(true);
    setError('');
    
    try {
      await updatePost(post.id, { content: editContent.trim() });
      setIsEditing(false);
      if (onPostUpdated) {
        onPostUpdated({ ...post, content: editContent.trim() });
      }
    } catch (error) {
      console.error('Failed to update post:', error);
      setError(error.message);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    setIsDeleting(true);
    try {
      await deletePost(post.id);
      if (onPostDeleted) {
        onPostDeleted(post.id);
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      setError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(post.content);
    setError('');
  };

  // Update comment count when new comments are added
  const updateCommentCount = (count) => {
    setCommentCount(count);
  };

  // Handle both uppercase (C#) and lowercase (JavaScript) user property
  const user = post.user || post.User;

  return (
    <article className="border-b border-white/20 p-4 hover:bg-white/5 transition-colors">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-full bg-white/20 flex-shrink-0 overflow-hidden">
          {user?.extraData?.profilePicture ? (
            <img 
              src={user.extraData.profilePicture} 
              alt={user.username || user.email || 'User'} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary flex items-center justify-center text-white font-bold">
              {(user?.username || user?.email || 'U').charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold hover:underline">
                {user?.extraData?.displayName || user?.username || user?.email || 'User'}
              </span>
              <span className="text-white/50">
                @{user?.username || user?.email?.split('@')[0] || 'user'}
              </span>
              <span className="text-white/50">·</span>
              <span className="text-white/50 hover:underline">{post.timeAgo}</span>
            </div>
            
            {isOwner && !isEditing && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-white/50 hover:text-blue-400 p-1 rounded-full hover:bg-blue-400/10"
                  title="Edit post"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-white/50 hover:text-red-400 p-1 rounded-full hover:bg-red-400/10 disabled:opacity-50"
                  title="Delete post"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          
          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                disabled={isUpdating}
                className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-[15px] leading-normal resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows="3"
                maxLength="280"
              />
              <div className="flex items-center justify-between mt-2">
                <div className="text-sm text-white/50">
                  {editContent.length}/280
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelEdit}
                    disabled={isUpdating}
                    className="px-4 py-2 text-sm border border-white/20 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={isUpdating || !editContent.trim() || editContent.length > 280}
                    className="px-4 py-2 text-sm bg-primary rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isUpdating ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
              {error && (
                <div className="text-red-400 text-sm mt-2 p-2 bg-red-400/10 rounded">
                  {error}
                </div>
              )}
            </div>
          ) : (
            <Link href={`/post/${post.id}`}>
              <p className="mt-2 text-[15px] leading-normal whitespace-pre-line cursor-pointer hover:text-white/90">{post.content}</p>
              
              {post.mediaUrl && (
                <div className="mt-3 rounded-xl overflow-hidden max-h-[500px]">
                  <img 
                    src={post.mediaUrl} 
                    alt="Post media" 
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
            </Link>
          )}
          
          <div className="flex justify-between mt-4 max-w-md text-white/50">
            <button 
              className="group flex items-center gap-2 hover:text-blue-400"
              onClick={toggleComments}
            >
              <div className="p-2 rounded-full group-hover:bg-blue-400/10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="text-sm">{commentCount}</span>
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
      
      {showComments && (
        <CommentSection 
          postId={post.id} 
          onCommentCountChange={updateCommentCount} 
        />
      )}
    </article>
  );
} 