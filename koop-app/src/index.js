// See .env for configuration
require("dotenv").config();

const Koop = require("@koopjs/koop-core");
const routes = require("./routes");
const plugins = require("./plugins");
require("dotenv").config();

// Initiate koop
const koop = new Koop();

// Regisister plugins - in this case the only plugin is the DHIS2 provider
plugins.forEach((plugin) => {
  koop.register(plugin.instance, plugin.options);
});

// Add additional routes
routes.forEach((route) => {
  route.methods.forEach((method) => {
    koop.server[method](route.path, route.handler);
  });
});

// Start the server
koop.server.listen(process.env.KOOP_PORT, () =>
  koop.log.info(`Koop server listening at ${process.env.KOOP_PORT}`)
);
