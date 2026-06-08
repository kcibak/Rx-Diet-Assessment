const cors = require("cors");
const express = require("express");
const fs = require("node:fs");
const path = require("node:path");

const { createBlockUserController } = require("./controllers/blockUserController");
const { createDatabaseHealthController, createHealthController } = require("./controllers/healthController");
const { createListAllUsersController } = require("./controllers/listAllUsersController");
const { createLoginController } = require("./controllers/loginController");
const { createRegisterController } = require("./controllers/registerController");
const { createSendMessageController } = require("./controllers/sendMessageController");
const { createUnblockUserController } = require("./controllers/unblockUserController");
const { createViewMessagesController } = require("./controllers/viewMessagesController");
const { checkDatabaseHealth } = require("./config/db");
const { createRequireAuth } = require("./middleware/requireAuth");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");
const { createBlockUser } = require("./services/blockUser");
const { createListAllUsers } = require("./services/listAllUsers");
const { createLoginUser } = require("./services/loginUser");
const { createRegisterUser } = require("./services/registerUser");
const { createSendMessage } = require("./services/sendMessage");
const { createUnblockUser } = require("./services/unblockUser");
const { createAuthenticateSession } = require("./services/authenticateSession");
const { createViewMessages } = require("./services/viewMessages");

function createApp({
  blockUser,
  registerUser,
  loginUser,
  viewMessages,
  sendMessage,
  listAllUsers,
  unblockUser,
  authenticateSession,
  checkHealth,
} = {}) {
  const resolvedBlockUser = blockUser || createBlockUser();
  const resolvedRegisterUser = registerUser || createRegisterUser();
  const resolvedLoginUser = loginUser || createLoginUser();
  const resolvedViewMessages = viewMessages || createViewMessages();
  const resolvedSendMessage = sendMessage || createSendMessage();
  const resolvedListAllUsers = listAllUsers || createListAllUsers();
  const resolvedUnblockUser = unblockUser || createUnblockUser();
  const resolvedAuthenticateSession = authenticateSession || createAuthenticateSession();
  const resolvedCheckHealth = checkHealth || checkDatabaseHealth;
  const app = express();
  const requireAuth = createRequireAuth({ authenticateSession: resolvedAuthenticateSession });

  app.use(cors());
  app.use(express.json());

  app.get("/api", (req, res) => {
    res.json({ message: "API running" });
  });

  if (process.env.NODE_ENV !== "production") {
    app.get("/", (req, res) => {
      res.json({ message: "API running" });
    });
  }

  app.get("/health", createHealthController());
  app.get("/health/db", createDatabaseHealthController({ checkHealth: resolvedCheckHealth }));

  app.post("/register", createRegisterController({ registerUser: resolvedRegisterUser }));
  app.post("/login", createLoginController({ loginUser: resolvedLoginUser }));
  app.post("/block_user", requireAuth, createBlockUserController({ blockUser: resolvedBlockUser }));
  app.post("/unblock_user", requireAuth, createUnblockUserController({ unblockUser: resolvedUnblockUser }));
  app.get("/view_messages", requireAuth, createViewMessagesController({ viewMessages: resolvedViewMessages }));
  app.post("/send_message", requireAuth, createSendMessageController({ sendMessage: resolvedSendMessage }));
  app.get("/list_all_users", requireAuth, createListAllUsersController({ listAllUsers: resolvedListAllUsers }));

  serveFrontend(app);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

function serveFrontend(app) {
  const frontendDistPath = path.join(__dirname, "../../dist");
  const indexPath = path.join(frontendDistPath, "index.html");

  if (!fs.existsSync(indexPath)) {
    return;
  }

  app.use(express.static(frontendDistPath));
  app.get(/.*/, (req, res) => {
    res.sendFile(indexPath);
  });
}

module.exports = {
  createApp,
};
