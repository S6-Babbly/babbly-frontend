'use client';

import { SWRConfig } from 'swr';
import axios from 'axios';
import swrConfig from '@/lib/swr';

// Client-side fetcher implementation
const clientFetcher = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default function SWRProvider({ children }) {
  return (
    <SWRConfig value={{ ...swrConfig, fetcher: clientFetcher }}>
      {children}
    </SWRConfig>
  );
} 