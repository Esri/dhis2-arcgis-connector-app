const packageInfo = require("../package.json");
// const koopConfig = require("../koop.json");

const provider = {
  type: "provider",
  version: packageInfo.version,
  name: "dhis2/analytics",
  hosts: true,
  disableIdParam: true,
  Model: require("./model"),
};

module.exports = provider;
