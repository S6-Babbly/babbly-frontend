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
  // Removed API rewrites since frontend now calls API Gateway directly
};

export default nextConfig;
