import pluginReactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import eslintReact from '@eslint-react/eslint-plugin';
import checkFile from 'eslint-plugin-check-file';
import globals from 'globals';
import { config as baseConfig } from './base.js';
import { componentName } from './rules/component-name.js';

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
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...jsxA11y.flatConfigs.strict.rules,
    },
  },
  pluginReactHooks.configs.flat.recommended,
  eslintReact.configs['naming-convention'],
  {
    files: ['**/*.tsx'],
    plugins: {
      pcgl: { rules: { 'component-name': componentName } },
    },
    rules: {
      'pcgl/component-name': 'error',
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'check-file': checkFile,
    },
    rules: {
      'check-file/filename-naming-convention': [
        'error',
        { '**/*.{ts,tsx}': 'KEBAB_CASE' },
        { ignoreMiddleExtensions: true },
      ],
      'check-file/folder-naming-convention': ['error', { 'src/**/': 'KEBAB_CASE' }],
    },
  },
];
