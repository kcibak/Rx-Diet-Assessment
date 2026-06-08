// Adapts the view-messages service to the GET /view_messages HTTP endpoint.
// Conversation identifiers are read from query parameters and service errors are centralized.
function createViewMessagesController({ viewMessages }) {
  return async function viewMessagesController(req, res, next) {
    try {
      const result = await viewMessages(req.query);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = {
  createViewMessagesController,
};
