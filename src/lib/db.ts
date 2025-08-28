// lib/db.ts
import { Pool } from 'pg';

declare global {
  // allow global pool across module reloads in dev
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

function makePool() {
  const sslRequired = process.env.PGSSLMODE === 'require' || process.env.PGSSLMODE === 'true';
  const pool = new Pool({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT || 5432),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    max: Number(process.env.PGMAXCLIENTS || 10),
    idleTimeoutMillis: 30000,
    ssl: sslRequired ? { rejectUnauthorized: false } : undefined,
  });
  return pool;
}

const pool = global.__pgPool ?? makePool();
if (!global.__pgPool) global.__pgPool = pool;

export default pool;
