import { getProfileByUsername } from '@/services/profileService';
import { getSession } from '@auth0/nextjs-auth0';
import Post from '@/components/Post';

export async function generateMetadata({ params }) {
  const { username } = params;
  return {
    title: `${username}'s Profile | Babbly`,
    description: `Check out ${username}'s profile on Babbly`,
  };
}

export default async function ProfilePage({ params }) {
  const { username } = params;
  
  try {
    // Get the profile and posts server-side
    const profile = await getProfileByUsername(username);
    
    return (
      <div className="p-4">
        {/* Profile header */}
        <div className="pb-4 border-b border-white/20">
          <div className="w-24 h-24 rounded-full bg-white/20 mb-4"></div>
          <h1 className="text-2xl font-bold">{profile.displayName || username}</h1>
          <p className="text-white/50">@{username}</p>
          <p className="mt-2">{profile.bio || 'No bio yet'}</p>
          
          <div className="flex gap-4 mt-3 text-sm text-white/70">
            <span>{profile.followersCount || 0} followers</span>
            <span>{profile.followingCount || 0} following</span>
            <span>{profile.postsCount || 0} posts</span>
          </div>
        </div>
        
        {/* Posts section */}
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-4">Posts</h2>
          
          {profile.posts && profile.posts.length > 0 ? (
            <div>
              {profile.posts.map(post => (
                <Post key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-white/70">No posts yet.</p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    // Handle errors in the UI
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
        <p className="text-white/70 mb-4">
          Sorry, we couldn't find a profile for @{username}
        </p>
        <a 
          href="/" 
          className="bg-primary px-4 py-2 rounded-full text-sm font-bold hover:bg-primary/90 inline-block"
        >
          Back to Home
        </a>
      </div>
    );
  }
} 