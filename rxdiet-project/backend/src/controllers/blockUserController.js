// Adapts the block-user service to the POST /block_user HTTP endpoint.
// The controller passes request body data through and delegates errors to Express middleware.
function createBlockUserController({ blockUser }) {
  return async function blockUserController(req, res, next) {
    try {
      const result = await blockUser(req.body);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = {
  createBlockUserController,
};
