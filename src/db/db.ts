import { Pool } from 'pg';

export const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  ssl: true,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
});
