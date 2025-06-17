/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [
      's.gravatar.com',
      'cdn.auth0.com',
      'lh3.googleusercontent.com', // For Google profile pictures
    ],
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5010';
    return [
      {
        source: '/api/posts/:path*',
        destination: `${apiUrl}/api/posts/:path*`,
      },
      {
        source: '/api/users/:path*',
        destination: `${apiUrl}/api/users/:path*`,
      },
      {
        source: '/api/comments/:path*',
        destination: `${apiUrl}/api/comments/:path*`,
      },
      {
        source: '/api/likes/:path*',
        destination: `${apiUrl}/api/likes/:path*`,
      },
      {
        source: '/api/feed/:path*',
        destination: `${apiUrl}/api/feed/:path*`,
      },
      {
        source: '/api/auth/me',
        destination: `${apiUrl}/api/auth/me`,
      },
      // Add health check endpoints
      {
        source: '/api/health/:path*',
        destination: `${apiUrl}/api/health/:path*`,
      },
      // Keep Auth0 routes local (don't proxy these)
      // /api/auth/login, /api/auth/logout, /api/auth/callback should stay local
    ];
  },
};

export default nextConfig;
