import Link from 'next/link';

export const metadata = {
  title: 'Account Deletion Requested',
};

export default function DeletionRequested() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Account Deletion Requested</h1>
      
      <div className="bg-white/10 rounded-xl p-6 max-w-2xl mx-auto">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Your deletion request has been received</h2>
          <p className="text-white/70">We&apos;re sorry to see you go!</p>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4 mb-6">
          <h3 className="font-medium mb-2">Next steps:</h3>
          <ol className="list-decimal pl-5 space-y-2 text-white/80">
            <li>Your account deletion has been queued for processing</li>
            <li>You&apos;ll receive an email confirmation when the process is complete</li>
            <li>Your data will be permanently removed within 30 days</li>
          </ol>
        </div>
        
        <p className="text-white/70 text-sm mb-6">
          If you change your mind, you can log back in within the next 14 days to cancel your deletion request.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/" 
            className="flex-1 py-3 bg-white/10 text-white text-center rounded-lg hover:bg-white/20"
          >
            Return to Homepage
          </Link>
          <Link 
            href="/api/auth/logout" 
            className="flex-1 py-3 bg-primary text-white text-center rounded-lg hover:bg-primary/90"
          >
            Log Out
          </Link>
        </div>
      </div>
    </div>
  );
} 