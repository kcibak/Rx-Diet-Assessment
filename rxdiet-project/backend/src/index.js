// Starts the Express server after loading local environment variables.
// The app factory is kept separate so route wiring can be reused without immediately binding a port.
const path = require("node:path");

require("dotenv").config({ path: path.resolve(__dirname, "../../.env"), quiet: true });

const { createApp } = require("./app");

const port = Number(process.env.PORT) || 3000;
const app = createApp();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
