# Babbly Frontend

## Overview

This is the frontend application for the Babbly social media platform. It's built with Next.js and TypeScript, providing a modern and responsive user interface.

## Features

- Modern, responsive UI
- Server-side rendering
- Real-time updates via WebSocket
- Authentication with Auth0

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/babbly-frontend.git
cd babbly-frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file with the following content:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
npm run build
# or
yarn build
```

## Docker

You can run the application using Docker with full API gateway integration:

### Environment Setup

1. Create a `.env` file in the project root with the following environment variables for Docker Compose:

```
# Auth0 Configuration
AUTH0_SECRET=your_long_random_secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-tenant.region.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret
AUTH0_AUDIENCE=https://api.babbly.com
AUTH0_SCOPE=openid profile email
```

### Running with Docker Compose

This setup assumes you have the API gateway running in a Docker network named `babbly-network`. If not, you'll need to create this network first:

```bash
docker network create babbly-network
```

Then, run the frontend connected to the API gateway:

```bash
# Start the frontend container
docker-compose up -d
```

This will:
1. Build the frontend container if needed
2. Connect it to the babbly-network where the API gateway should be running
3. Expose the app on port 3000

### Standalone Docker Build

If you prefer to run the frontend container separately:

```bash
# Build the Docker image
docker build -t babbly-frontend .

# Run the container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://api-gateway:5000 \
  -e AUTH0_SECRET=your_long_random_secret \
  -e AUTH0_BASE_URL=http://localhost:3000 \
  -e AUTH0_ISSUER_BASE_URL=https://your-tenant.region.auth0.com \
  -e AUTH0_CLIENT_ID=your_client_id \
  -e AUTH0_CLIENT_SECRET=your_client_secret \
  -e AUTH0_AUDIENCE=https://api.babbly.com \
  -e AUTH0_SCOPE="openid profile email" \
  --network babbly-network \
  babbly-frontend
```

### Testing the Integration

Once running, you should be able to:
1. Navigate to http://localhost:3000
2. Log in using Auth0
3. See posts from the API gateway
4. Create posts, add comments, and like content

## Auth0 Configuration

For Auth0 to work correctly, especially in Docker:

1. In your Auth0 Dashboard, go to Applications > [Your App] > Settings
2. Under "Allowed Callback URLs", add:
   - http://localhost:3000/api/auth/callback
3. Under "Allowed Logout URLs", add:
   - http://localhost:3000
4. Under "Allowed Web Origins", add:
   - http://localhost:3000
5. Save the changes

When running in Docker, ensure these environment variables are correctly set in docker-compose.yml:

```yaml
- AUTH0_SECRET=your_long_secret_value
- AUTH0_BASE_URL=http://localhost:3000
- AUTH0_ISSUER_BASE_URL=https://your-tenant.region.auth0.com
- AUTH0_CLIENT_ID=your_client_id
- AUTH0_CLIENT_SECRET=your_client_secret
```

These must match exactly with the values in your Auth0 dashboard.

## API Gateway Integration

This frontend is integrated with the Babbly API Gateway. The integration includes:

1. **Auth0 Authentication**: Secure authentication with JWT tokens
2. **API Client**: Axios-based client with interceptors for handling auth and errors
3. **Service Layer**: Organized service modules for different API resources
4. **State Management**: Zustand for global state management

### Configuration

1. Create a `.env.local` file in the root directory with the following variables:

```
# API Gateway URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Auth0 Configuration
AUTH0_SECRET='use-a-strong-random-string-here'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://your-auth0-domain.auth0.com'
AUTH0_CLIENT_ID='your-auth0-client-id'
AUTH0_CLIENT_SECRET='your-auth0-client-secret'
AUTH0_AUDIENCE='https://api.babbly.com'
AUTH0_SCOPE='openid profile email'
```

2. Replace the Auth0 credentials with your actual values from the Auth0 dashboard.

### API Structure

The frontend communicates with these API endpoints:

- **Feed**: `/api/feed` - Get the feed of posts
- **Posts**: `/api/posts` - Create, read, update, delete posts
- **Comments**: `/api/comments` - Manage comments on posts
- **Likes**: `/api/likes` - Like/unlike posts and comments
- **Profiles**: `/api/profiles` - User profiles and information

### Development

To run the frontend with API integration:

```bash
npm run dev
```

The application will connect to the API Gateway at the URL specified in `NEXT_PUBLIC_API_URL`.

## CI/CD Pipeline

This repository uses GitHub Actions for continuous integration and deployment:

- **Code Quality**: SonarCloud analysis
- **Tests**: Component and integration tests
- **Docker Build**: Builds and validates Docker image
- **Deployment**: Automated deployment to staging/production environments

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
