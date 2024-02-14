import NextAuth from 'next-auth';
import { authConfig } from './app/api/auth/auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  // matches all request except ones starting with api, _next/static, _next/image, and png files
  //   // matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
  matcher: ['/login/:path*', '/favorites/:path*', '/profile/:path*'],
};
