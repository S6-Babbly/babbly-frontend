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
      console.log('🚀 SWR Fetcher called for:', url);
      
      // Get token for authenticated requests
      const token = await getToken();
      console.log('🔑 Token retrieved:', !!token);
      
      const result = await apiRequest(url, 'get', null, token);
      console.log('✅ API request successful for:', url, 'Data:', result);
      
      return result;
    } catch (error) {
      console.error('❌ SWR Fetcher error for:', url, 'Error:', error);
      throw error;
    }
  };

  return (
    <SWRConfig value={{ ...swrConfig, fetcher: clientFetcher }}>
      {children}
    </SWRConfig>
  );
} 