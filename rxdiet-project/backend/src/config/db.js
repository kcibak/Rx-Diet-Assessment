// Creates and shares the PostgreSQL connection pool used by repositories.
// The pool is configured from DATABASE_URL and exposes a lightweight health check query.
const { Pool } = require("pg");

let pool;

function createDbPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Missing required database env var: DATABASE_URL");
  }

  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: shouldUseSsl(process.env.DATABASE_URL)
      ? { rejectUnauthorized: false }
      : false,
    max: Number(process.env.DB_POOL_MAX) || 10,
    connectionTimeoutMillis: Number(process.env.DB_CONNECTION_TIMEOUT_MS) || 5000,
  });
}

function getDbPool() {
  if (!pool) {
    pool = createDbPool();
  }

  return pool;
}

async function checkDatabaseHealth() {
  const db = getDbPool();
  await db.query("SELECT 1 AS ok");

  return {
    status: "ok",
    database: "up",
  };
}

function shouldUseSsl(databaseUrl) {
  try {
    const parsed = new URL(databaseUrl);
    const host = parsed.hostname;

    if (["localhost", "127.0.0.1", "::1"].includes(host)) {
      return false;
    }

    return true;
  } catch (error) {
    return true;
  }
}

module.exports = {
  checkDatabaseHealth,
  getDbPool,
};
