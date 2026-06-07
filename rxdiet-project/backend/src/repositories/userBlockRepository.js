const { getDbPool } = require("../config/db");

function createUserBlockRepository({ db = getDbPool() } = {}) {
  return {
    async createBlock(blockerId, blockedId) {
      await db.query(
        `INSERT INTO user_blocks (blocker_id, blocked_id)
         VALUES ($1, $2)`,
        [blockerId, blockedId]
      );
    },

    async deleteBlock(blockerId, blockedId) {
      const result = await db.query(
        `DELETE FROM user_blocks
         WHERE blocker_id = $1 AND blocked_id = $2`,
        [blockerId, blockedId]
      );

      return result.rowCount;
    },

    async blockExistsBetweenUsers(userIdA, userIdB) {
      const { rows } = await db.query(
        `SELECT id
         FROM user_blocks
         WHERE (blocker_id = $1 AND blocked_id = $2)
            OR (blocker_id = $3 AND blocked_id = $4)
         LIMIT 1`,
        [userIdA, userIdB, userIdB, userIdA]
      );

      return rows.length > 0;
    },

    async listBlockedUserIds(blockerId) {
      const { rows } = await db.query(
        `SELECT blocked_id
         FROM user_blocks
         WHERE blocker_id = $1`,
        [blockerId]
      );

      return rows.map((row) => row.blocked_id);
    },
  };
}

module.exports = {
  createUserBlockRepository,
};
