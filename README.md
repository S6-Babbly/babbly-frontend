# Babbly Frontend

This is the frontend application for the Babbly social media platform, built with Next.js.

## Features

- Secure authentication via Auth0
- Real-time posts and comments
- User profiles and settings
- Protected routes with role-based access control
- Modern, responsive UI

## Tech Stack

- Next.js (App Router)
- React
- Auth0 for authentication
- SWR for data fetching
- Tailwind CSS for styling

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Auth0 account

### Auth0 Setup

1. Create a new application in the Auth0 dashboard
   - Choose "Regular Web Application"
   
2. Configure the following URLs in your Auth0 application settings:
   - **Allowed Callback URLs**: `http://localhost:3000/api/auth/callback`
   - **Allowed Logout URLs**: `http://localhost:3000`
   - **Allowed Web Origins**: `http://localhost:3000`

3. Create an API in Auth0
   - Set the identifier to `https://api.babbly.com` (or your preferred audience)
   - Enable RBAC and Add Permissions in the Access Token

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-org/babbly-frontend.git
   cd babbly-frontend
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Create `.env.local` file
   ```bash
   cp env.example .env.local
   ```

4. Update `.env.local` with your Auth0 credentials
   ```
   AUTH0_SECRET='LONG_RANDOM_VALUE_AT_LEAST_32_CHARS'
   AUTH0_BASE_URL='http://localhost:3000'
   AUTH0_ISSUER_BASE_URL='https://YOUR_AUTH0_DOMAIN'
   AUTH0_CLIENT_ID='YOUR_AUTH0_CLIENT_ID'
   AUTH0_CLIENT_SECRET='YOUR_AUTH0_CLIENT_SECRET'
   AUTH0_AUDIENCE='https://api.babbly.com'
   AUTH0_SCOPE='openid profile email offline_access'
   
   NEXT_PUBLIC_API_URL='http://localhost:5010'
   ```

5. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Authentication Flow

1. User clicks "Login" on the frontend
2. User is redirected to Auth0 login page
3. After successful authentication, Auth0 redirects back to the frontend
4. Access token is stored in an HTTP-only cookie
5. Frontend includes token in API requests to backend services
6. API Gateway validates the token
7. User info is forwarded to microservices

## Project Structure

```
src/
├── app/              # App router pages and API routes
├── components/       # Reusable UI components
├── context/          # React context providers
├── lib/              # Utilities and helpers
├── services/         # API service modules
└── styles/           # Global styles
```

## Key Components

- `AuthContext`: Manages user authentication state
- `withAuth`: HOC to protect routes requiring authentication
- `withAuthorization`: HOC for role-based access control
- `SWRProvider`: Provides data fetching capabilities

## Docker Support

You can also run the frontend using Docker:

```bash
docker-compose up -d
```

This will start the frontend on port 3000.

## Testing

```bash
npm run test
# or
yarn test
```

## Building for Production

```bash
npm run build
# or
yarn build
```

## Deployment

The project can be deployed to any hosting platform that supports Next.js, such as Vercel, Netlify, or your own servers.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
