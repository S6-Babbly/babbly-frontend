import { handleAuth } from '@auth0/nextjs-auth0';

// Simplest configuration that works reliably in Docker
export const GET = handleAuth(); 