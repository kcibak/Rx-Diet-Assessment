// Encapsulates SQL operations for user records and user listing.
// It maps database column names into the camelCase objects expected by services.
const { getDbPool } = require("../config/db");

function mapUserRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    publicId: row.public_id,
    email: row.email,
    passwordHash: row.password_hash,
    firstName: row.first_name,
    lastName: row.last_name,
  };
}

function mapUserSummaryRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    publicId: row.public_id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
  };
}

function normalizePaginationValue(value, fallback) {
  const normalized = Number(value);

  if (!Number.isInteger(normalized) || normalized < 0) {
    return fallback;
  }

  return normalized;
}

function createUserRepository({ db = getDbPool() } = {}) {
  return {
    async createUser({ publicId, email, passwordHash, firstName, lastName }) {
      await db.query(
        `INSERT INTO users (public_id, email, password_hash, first_name, last_name)
         VALUES ($1, $2, $3, $4, $5)`,
        [publicId, email, passwordHash, firstName, lastName]
      );

      return {
        publicId,
        email,
        firstName,
        lastName,
      };
    },

    async findUserByEmail(email) {
      const { rows } = await db.query(
        `SELECT id, public_id, email, password_hash, first_name, last_name
         FROM users
         WHERE email = $1
         LIMIT 1`,
        [email]
      );

      return mapUserRow(rows[0]);
    },

    async findUserByPublicId(publicId) {
      const { rows } = await db.query(
        `SELECT id, public_id, email, password_hash, first_name, last_name
         FROM users
         WHERE public_id = $1
         LIMIT 1`,
        [publicId]
      );

      return mapUserRow(rows[0]);
    },

    async findUsersByPublicIds(publicIds) {
      if (!Array.isArray(publicIds) || publicIds.length === 0) {
        return [];
      }

      const { rows } = await db.query(
        `SELECT id, public_id, email, password_hash, first_name, last_name
         FROM users
         WHERE public_id = ANY($1::uuid[])`,
        [publicIds]
      );

      return rows.map(mapUserRow);
    },

    async findUsersByIds(userIds) {
      if (!Array.isArray(userIds) || userIds.length === 0) {
        return [];
      }

      const { rows } = await db.query(
        `SELECT id, public_id, email, password_hash, first_name, last_name
         FROM users
         WHERE id = ANY($1::int[])`,
        [userIds]
      );

      return rows.map(mapUserRow);
    },

    async listUsersExcludingPublicId(requesterPublicId, { limit = 50, offset = 0 } = {}) {
      const normalizedLimit = normalizePaginationValue(limit, 50);
      const normalizedOffset = normalizePaginationValue(offset, 0);
      const { rows } = await db.query(
        `SELECT id, public_id, email, first_name, last_name
         FROM users
         WHERE public_id <> $1
         ORDER BY first_name ASC, last_name ASC, email ASC
         LIMIT $2 OFFSET $3`,
        [requesterPublicId, normalizedLimit, normalizedOffset]
      );

      return rows.map(mapUserSummaryRow);
    },

    async listUsersExcludingPublicIdBlockedByUser(requesterPublicId, blockerId, { limit = 50, offset = 0 } = {}) {
      const normalizedLimit = normalizePaginationValue(limit, 50);
      const normalizedOffset = normalizePaginationValue(offset, 0);
      const { rows } = await db.query(
        `SELECT u.id, u.public_id, u.email, u.first_name, u.last_name
         FROM users u
         WHERE u.public_id <> $1
           AND NOT EXISTS (
             SELECT 1
             FROM user_blocks ub
             WHERE ub.blocker_id = $2
               AND ub.blocked_id = u.id
           )
         ORDER BY u.first_name ASC, u.last_name ASC, u.email ASC
         LIMIT $3 OFFSET $4`,
        [requesterPublicId, blockerId, normalizedLimit, normalizedOffset]
      );

      return rows.map(mapUserSummaryRow);
    },
  };
}

module.exports = {
  createUserRepository,
};
