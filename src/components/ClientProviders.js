'use client';

import { UserProvider } from '@auth0/nextjs-auth0/client';
import { AuthProvider } from '@/context/AuthContext';
import SWRProvider from '@/components/SWRProvider';
import DynamicTitle from '@/components/DynamicTitle';

export default function ClientProviders({ children }) {
  return (
    <UserProvider>
      <AuthProvider>
        <SWRProvider>
          <DynamicTitle />
          {children}
        </SWRProvider>
      </AuthProvider>
    </UserProvider>
  );
} 