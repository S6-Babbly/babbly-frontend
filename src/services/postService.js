const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function getAllPosts() {
  try {
    const response = await fetch(`${API_URL}/api/post`);
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostById(id) {
  try {
    const response = await fetch(`${API_URL}/api/post/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch post with id ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    return null;
  }
}

export async function getPostsByUserId(userId) {
  try {
    const response = await fetch(`${API_URL}/api/post/user/${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch posts for user ${userId}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error);
    return [];
  }
}

export async function createPost(content) {
  try {
    const response = await fetch(`${API_URL}/api/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 0, // Default user ID for now
        content,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData || 'Failed to create post');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

export async function updatePost(id, content) {
  try {
    const response = await fetch(`${API_URL}/api/post/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update post ${id}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error updating post ${id}:`, error);
    throw error;
  }
}

export async function deletePost(id) {
  try {
    const response = await fetch(`${API_URL}/api/post/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete post ${id}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting post ${id}:`, error);
    throw error;
  }
}

export async function likePost(id) {
  try {
    const response = await fetch(`${API_URL}/api/post/${id}/like`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to like post ${id}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error liking post ${id}:`, error);
    throw error;
  }
} 