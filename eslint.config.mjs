import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";


export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended", "plugin:@typescript-eslint/recommended"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "off",
      "indent": ["error", 2],
      "quotes": ["error", "single"],
      "semi": ["error", "always"],
      "no-unused-vars": ["error", { "args": "none" }],
      "no-extra-semi": "error",
      "no-unused-labels": "error",
      "no-use-before-define": ["error", "nofunc"],
      "no-multi-spaces": "error",
      "no-multi-assign": "error",
      "no-var": "error",
      "prefer-const": "error",
      "object-shorthand": ["error", "always"],
      "func-call-spacing": ["error", "never"],
      "space-infix-ops": "error",
      "key-spacing": ["error", { "beforeColon": false }],
      "comma-dangle": ["error", {
        "arrays": "never",
        "objects": "never",
        "imports": "never",
        "exports": "never",
        "functions": "never"
      }],
      "comma-spacing": ["error", { "before": false, "after": true }],
      "array-bracket-spacing": ["error", "never"],
      "object-curly-spacing": ["error", "always"],
      "arrow-parens": ["error", "always"],
      "arrow-spacing": ["error", { "before": true, "after": true }],
      "no-return-assign": ["error", "always"],
      "no-useless-constructor": "error",
      "no-this-before-super": "error",
      "no-undef": "error",
      "no-underscore-dangle": ["error", { "allowAfterThis": true }],
      "no-duplicate-imports": "error",
      "no-shadow": "error",
      "no-mixed-spaces-and-tabs": "error",
      "no-spaced-func": "error",
      "no-trailing-spaces": "error"
    }
  },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: globals.node } },
]);
