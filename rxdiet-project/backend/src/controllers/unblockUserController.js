// Adapts the unblock-user service to the POST /unblock_user HTTP endpoint.
// The controller keeps HTTP handling thin and leaves business rules in the service layer.
function createUnblockUserController({ unblockUser }) {
  return async function unblockUserController(req, res, next) {
    try {
      const result = await unblockUser(req.body);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = {
  createUnblockUserController,
};
