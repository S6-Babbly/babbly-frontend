'use client';

import { SWRConfig } from 'swr';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import swrConfig from '@/lib/swr';

export default function SWRProvider({ children }) {
  const { getToken } = useAuth();
  
  // Client-side fetcher implementation that includes authentication
  const clientFetcher = async (url) => {
    try {
      // Get token for authenticated requests
      const token = await getToken();
      return await apiRequest(url, 'get', null, token);
    } catch (error) {
      throw error;
    }
  };

  return (
    <SWRConfig value={{ ...swrConfig, fetcher: clientFetcher }}>
      {children}
    </SWRConfig>
  );
} 