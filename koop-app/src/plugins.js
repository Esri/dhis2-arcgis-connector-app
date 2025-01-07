const klawSync = require("klaw-sync");
const fs = require("fs-extra");
const path = require("path");

const providers = [];

const providerPath = path.join(__dirname, "../providers");

// Ensure that providerPath represents a valid directory
if (fs.ensureDir(providerPath)) {
  // Find all (and only) directories under providerPath with no recursion
  const providerDirs = klawSync(providerPath, { nofile: true, depthLimit: 0 });

  // For provider directory...
  providerDirs.forEach((providerDir) => {
    // Add the provider to the providers array
    providers.push({
      instance: require(providerDir.path),
    });
  });
}

// Export the providers array
module.exports = providers;
