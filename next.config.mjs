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
    return [
      {
        source: '/api/posts/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/posts/:path*`,
      },
      {
        source: '/api/users/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/:path*`,
      },
      // Add other specific API routes as needed, but leave /api/auth for Auth0
    ];
  },
};

export default nextConfig;
