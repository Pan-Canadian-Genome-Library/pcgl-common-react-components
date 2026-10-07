import pluginReactHooks from "eslint-plugin-react-hooks";
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from "globals";
import { config as baseConfig } from "./base.js";

/**
 * A custom ESLint configuration for libraries that use React.
 *
 * @type {import("eslint").Linter.Config[]} */
export const config = [
  ...baseConfig,
  {
    languageOptions: {
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    plugins: {
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...jsxA11y.flatConfigs.strict.rules,
    },
  },
  pluginReactHooks.configs.flat.recommended,
];
