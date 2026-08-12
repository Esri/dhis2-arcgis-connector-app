/*Copyright 2025 Esri
Licensed under the Apache License Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.*/

// Vendors the installed Calcite assets into public/assets so icons and
// component translations are served locally (ArcGIS Enterprise / offline safe)
// instead of being fetched from an external CDN. Runs on install and before
// start/build; the copied files are gitignored (public/assets/*).
const fs = require("fs");
const path = require("path");

const repoRoot = path.join(__dirname, "..");
const source = path.join(
  repoRoot,
  "node_modules",
  "@esri",
  "calcite-components",
  "dist",
  "calcite",
  "assets"
);
const dest = path.join(repoRoot, "public", "assets");

if (!fs.existsSync(source)) {
  console.warn(
    `[calcite-assets] Calcite assets not found at ${source}; skipping copy. ` +
      "Run `npm install` so @esri/calcite-components is present."
  );
  process.exit(0);
}

fs.rmSync(dest, { recursive: true, force: true });
fs.mkdirSync(dest, { recursive: true });
fs.cpSync(source, dest, { recursive: true });

console.log(
  `[calcite-assets] Copied Calcite assets to ${path.relative(
    process.cwd(),
    dest
  )}`
);
