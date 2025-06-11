import { handleAuth, handleLogin, handleCallback, handleLogout } from '@auth0/nextjs-auth0';

// Define auth handler with additional configuration
export const GET = handleAuth({
  login: handleLogin({
    authorizationParams: {
      // Setting audience for the API
      audience: process.env.AUTH0_AUDIENCE,
      // Request these scopes
      scope: process.env.AUTH0_SCOPE
    },
    returnTo: '/'
  }),
  callback: handleCallback({
    afterCallback: (req, session, state) => {
      console.log('--- Auth0 Callback Handler ---');
      console.log('Session created:', !!session);
      if (session) {
        console.log('Session contains accessToken:', 'accessToken' in session);
      }
      console.log('------------------------------');
      return session;
    }
  }),
  logout: handleLogout({
    returnTo: '/'
  })
}); 