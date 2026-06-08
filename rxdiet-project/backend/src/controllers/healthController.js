function createHealthController() {
  return async function healthController(req, res) {
    res.status(200).json({
      status: "ok",
      service: "up",
    });
  };
}

function createDatabaseHealthController({ checkHealth }) {
  return async function databaseHealthController(req, res) {
    try {
      const result = await checkHealth();
      res.status(200).json(result);
    } catch (error) {
      console.error("Database health check failed", {
        code: error.code,
        message: error.message,
      });

      res.status(503).json({
        status: "error",
        database: "down",
      });
    }
  };
}

module.exports = {
  createDatabaseHealthController,
  createHealthController,
};
