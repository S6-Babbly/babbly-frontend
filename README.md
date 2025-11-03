# Babbly Frontend

The web interface for the Babbly social media platform, built with Next.js and featuring Auth0 authentication.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React
- **Authentication**: Auth0
- **Data Fetching**: SWR
- **Styling**: Tailwind CSS

## Features

- Secure authentication via Auth0
- Post creation and feed viewing
- User profiles and comments
- Protected routes with role-based access control
- Modern, responsive UI

## Local Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Auth0 account

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

### Auth0 Configuration

1. Create a new application in the Auth0 dashboard:
   - Choose "Regular Web Application"
   
2. Configure the following URLs in your Auth0 application settings:
   - **Allowed Callback URLs**: `http://localhost:3000/api/auth/callback`
   - **Allowed Logout URLs**: `http://localhost:3000`
   - **Allowed Web Origins**: `http://localhost:3000`

3. Create an API in Auth0:
   - Set the identifier to `https://api.babbly.com`
   - Enable RBAC and "Add Permissions in the Access Token"

## Architecture Notes

The frontend communicates with backend microservices through the API Gateway. Authentication flow:

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

## Docker Support

Run the frontend using Docker Compose (along with other services):

```bash
# From the root of the Babbly organization
docker-compose up -d frontend
```

The frontend will be available at `http://localhost:3000`.

## Key Components

- `AuthContext`: Manages user authentication state
- `withAuth`: HOC to protect routes requiring authentication
- `withAuthorization`: HOC for role-based access control
- `SWRProvider`: Provides data fetching capabilities

## License

This project is licensed under the MIT License - see the LICENSE file for details.
