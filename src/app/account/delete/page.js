'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function DeleteAccount() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [reason, setReason] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  // Redirect if not logged in
  if (!isLoading && !user) {
    router.push('/login');
    return null;
  }
  
  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  const handleDelete = () => {
    // Here you would handle the actual deletion process
    router.push('/api/auth/delete-account');
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Delete Account</h1>
      
      <div className="bg-white/10 rounded-xl p-6 max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-red-400">
            Are you sure you want to delete your account?
          </h2>
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-white mb-2">This action will:</p>
            <ul className="list-disc pl-5 space-y-1 text-white/80">
              <li>Permanently delete your profile</li>
              <li>Remove all your posts and comments</li>
              <li>Cancel any subscriptions</li>
              <li>Delete all your personal data</li>
            </ul>
            <p className="mt-3 text-red-300 font-medium">This action cannot be undone.</p>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-white/80 mb-2">
            Would you mind telling us why you&apos;re leaving? (Optional)
          </label>
          <select 
            value={reason} 
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg p-2 text-white"
          >
            <option value="">Select a reason...</option>
            <option value="not-using">I don&apos;t use this service anymore</option>
            <option value="too-complex">It&apos;s too complicated to use</option>
            <option value="data-privacy">Data privacy concerns</option>
            <option value="temp-break">I&apos;m taking a break</option>
            <option value="other">Other reason</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label className="flex items-start space-x-2">
            <input 
              type="checkbox" 
              checked={isConfirmed}
              onChange={() => setIsConfirmed(!isConfirmed)}
              className="mt-1"
            />
            <span className="text-white/80">
              I understand that deleting my account will permanently remove all my data, and that this action cannot be reversed.
            </span>
          </label>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/profile" 
            className="flex-1 py-3 bg-white/10 text-white text-center rounded-lg hover:bg-white/20"
          >
            Cancel
          </Link>
          <button 
            onClick={handleDelete}
            disabled={!isConfirmed}
            className={`flex-1 py-3 text-white text-center rounded-lg ${
              isConfirmed 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-red-600/50 cursor-not-allowed'
            }`}
          >
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
} 