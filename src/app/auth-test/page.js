'use client';

import { useUser } from '@auth0/nextjs-auth0/client';

export default function AuthTestPage() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Auth0 Raw Data Test</h1>
      
      {!user ? (
        <div>
          <p>Not logged in</p>
          <a href="/api/auth/login" className="bg-blue-500 text-white px-4 py-2 rounded">
            Login
          </a>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">Auth0 User Object:</h2>
          <pre className="bg-black text-green-400 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold mb-2">Key Properties:</h3>
              <ul className="space-y-1 text-sm">
                <li><strong>ID:</strong> {user.sub}</li>
                <li><strong>Email:</strong> {user.email}</li>
                <li><strong>Name:</strong> {user.name}</li>
                <li><strong>Nickname:</strong> {user.nickname}</li>
                <li><strong>Picture:</strong> {user.picture ? 'Yes' : 'No'}</li>
                <li><strong>Email Verified:</strong> {user.email_verified ? 'Yes' : 'No'}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2">All Properties:</h3>
              <ul className="space-y-1 text-sm">
                {Object.keys(user).map(key => (
                  <li key={key}><strong>{key}:</strong> {typeof user[key]}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 