import { handleAuth, handleLogin, handleCallback, handleLogout } from '@auth0/nextjs-auth0';

// Define auth handler with additional configuration
export const GET = handleAuth({
  login: handleLogin({
    authorizationParams: {
      // Setting audience for the API
      audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
      // Request these scopes
      scope: 'openid profile email offline_access'
    },
    returnTo: '/'
  }),
  callback: handleCallback({
    afterCallback: (req, res, session) => {
      // You can modify the session here if needed
      return session;
    }
  }),
  logout: handleLogout({
    returnTo: '/'
  })
}); 