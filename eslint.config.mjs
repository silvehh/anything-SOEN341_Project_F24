import globals from "globals";
import pluginJs from "@eslint/js";
import eslintPluginHtml from "eslint-plugin-html";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node, // Include Node.js globals
      },
    },
    plugins: {
      html: eslintPluginHtml,
    },
    rules: {
      "no-unused-vars": "warn", // Warn for unused variables
      "eqeqeq": "error",        // Enforce strict equality
      "no-console": "off",      // Allow console logs for debugging
    },
  },
  pluginJs.configs.recommended, // Include recommended JavaScript rules
  {
    files: ["*.html"],
    processor: "html/html", // Process embedded JS in HTML
  },
];
