import { getSession } from '@auth0/nextjs-auth0';
import Image from 'next/image';
import Link from 'next/link';

// Add metadata to the profile page
export const metadata = {
  title: 'Profile',
};

export default async function Profile() {
  // Use try-catch to handle potential errors with getSession
  try {
    const session = await getSession();
    const user = session?.user;

    if (!user) {
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Profile</h1>
          <p>Please log in to view your profile.</p>
        </div>
      );
    }

    // Get display name - use nickname, name, or extract from email
    const displayName = user.nickname || user.name || (user.email ? user.email.split('@')[0] : 'User');
    // Create username for profile display
    const username = user.nickname || user.email.split('@')[0];
    
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        
        <div className="bg-white/10 rounded-xl p-6">
          <div className="flex items-center gap-6 mb-6">
            {user.picture && (
              <div className="relative w-24 h-24 rounded-full overflow-hidden">
                <Image 
                  src={user.picture} 
                  alt={displayName} 
                  fill 
                  className="object-cover" 
                />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold">{displayName}</h2>
              <p className="text-white/70">@{username}</p>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-4">
            <h3 className="text-lg font-semibold mb-2">Account Details</h3>
            <dl className="space-y-2">
              <div className="grid grid-cols-3">
                <dt className="text-white/60">Email:</dt>
                <dd className="col-span-2">{user.email}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="text-white/60">Email Verified:</dt>
                <dd className="col-span-2">{user.email_verified ? 'Yes' : 'No'}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="text-white/60">Joined:</dt>
                <dd className="col-span-2">{new Date(user.updated_at).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>
          
          {/* Account Actions Section */}
          <div className="mt-8 space-y-4">
            <Link 
              href="/api/auth/logout" 
              className="block w-full py-3 bg-primary text-white text-center rounded-lg hover:bg-primary/90"
            >
              Logout
            </Link>
            
            <div className="mt-4 bg-red-900/30 border border-red-500/50 rounded-lg p-4">
              <p className="text-white mb-3">Want to delete your account?</p>
              <p className="text-white/70 text-sm mb-3">
                This will permanently remove all your data from our platform.
              </p>
              <Link 
                href="/account/delete"
                className="block w-full py-2 bg-red-600 text-white text-center rounded-md hover:bg-red-700"
              >
                Delete Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p>Error loading profile. Please try again later.</p>
      </div>
    );
  }
} 