// Adapts the list-users service to the GET /list_all_users HTTP endpoint.
// Query parameters are forwarded to the service, and errors continue through centralized handling.
function createListAllUsersController({ listAllUsers }) {
  return async function listAllUsersController(req, res, next) {
    try {
      const result = await listAllUsers(req.query);

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = {
  createListAllUsersController,
};
