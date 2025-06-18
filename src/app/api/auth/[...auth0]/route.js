import { handleAuth, handleLogin, handleCallback, handleLogout } from '@auth0/nextjs-auth0';

// Define auth handler with additional configuration
export const GET = handleAuth({
  login: handleLogin({
    authorizationParams: {
      // Setting audience for the API
      audience: process.env.AUTH0_AUDIENCE || 'https://api.babbly.com',
      // Request these scopes
      scope: 'openid profile email'
    },
    returnTo: '/'
  }),
  callback: handleCallback({
    authorizationParams: {
      // Ensure we request the API audience in callback too
      audience: process.env.AUTH0_AUDIENCE || 'https://api.babbly.com',
      scope: 'openid profile email'
    },
    afterCallback: (req, session, state) => {
      // Session is already created with user info and tokens
      return session;
    }
  }),
  logout: handleLogout({
    returnTo: '/'
  })
}); 