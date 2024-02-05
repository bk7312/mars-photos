import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import { authConfig } from './auth.config';
import PostgresAdapter from '@auth/pg-adapter';
import { Pool } from 'pg';

// import { sql } from '@vercel/postgres';
// import type { UserType } from '@/lib/types';

// async function getUser(email: string): Promise<UserType | undefined> {
//   try {
//     const user = await sql<UserType>`SELECT * FROM users WHERE email=${email}`;
//     return user.rows[0];
//   } catch (error) {
//     console.error('Failed to fetch user:', error);
//     throw new Error('Failed to fetch user.');
//   }
// }

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  ssl: true,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  ...authConfig,
  // adapter: PostgresAdapter(pool),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
});
