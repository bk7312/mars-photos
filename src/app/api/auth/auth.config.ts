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
      const isOnProtectedRoute =
        nextUrl.pathname.startsWith('/favorites') ||
        nextUrl.pathname.startsWith('/profile');

      if (isOnProtectedRoute && !isLoggedIn) {
        return Response.redirect(new URL('/', nextUrl));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
