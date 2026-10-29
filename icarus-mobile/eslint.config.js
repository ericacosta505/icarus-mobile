const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
module.exports = defineConfig([
  expoConfig,
  { ignores: ["dist/*"] },
  // Existing prop-to-state synchronization predates React Compiler. Keep these
  // findings visible while adopting the current Expo lint configuration.
  { rules: { "react-hooks/set-state-in-effect": "warn" } },
]);
