const { getDbPool } = require("../config/db");

function createSessionRepository({ db = getDbPool() } = {}) {
  return {
    async createSession({ userId, tokenHash, expiresAt }) {
      await db.query(
        `INSERT INTO sessions (user_id, token_hash, expires_at)
         VALUES ($1, $2, $3)`,
        [userId, tokenHash, expiresAt]
      );
    },

    async findSessionByTokenHash(tokenHash) {
      const { rows } = await db.query(
        `SELECT s.id, s.user_id, s.token_hash, s.expires_at, u.public_id, u.email, u.password_hash, u.first_name, u.last_name
         FROM sessions s
         INNER JOIN users u ON u.id = s.user_id
         WHERE s.token_hash = $1
         LIMIT 1`,
        [tokenHash]
      );

      if (!rows[0]) {
        return null;
      }

      return {
        id: rows[0].id,
        userId: rows[0].user_id,
        tokenHash: rows[0].token_hash,
        expiresAt: rows[0].expires_at,
        user: {
          id: rows[0].user_id,
          publicId: rows[0].public_id,
          email: rows[0].email,
          passwordHash: rows[0].password_hash,
          firstName: rows[0].first_name,
          lastName: rows[0].last_name,
        },
      };
    },

    async deleteSessionByTokenHash(tokenHash) {
      await db.query("DELETE FROM sessions WHERE token_hash = $1", [tokenHash]);
    },
  };
}

module.exports = {
  createSessionRepository,
};
