import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    // // redirects user to custom login page instead of nextauth default
    // signIn: '/login',
    // signIn: '/auth/signin',
    // signOut: '/auth/signout',
    // error: '/auth/error',
    // verifyRequest: '/auth/verify-request',
    // newUser: '/auth/new-user',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProtectedRoute = nextUrl.pathname.startsWith('/favorites');
      const isOnLoginPage = nextUrl.pathname.startsWith('/login');

      if (isOnProtectedRoute) {
        // if user not logged in, return false to redirect to login page
        return isLoggedIn ? true : false;
      }

      if (isOnLoginPage && isLoggedIn) {
        // redirects to home page if user is already logged in
        // to use search params to send a message notifying user already logged in?
        return Response.redirect(new URL('/', nextUrl));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
