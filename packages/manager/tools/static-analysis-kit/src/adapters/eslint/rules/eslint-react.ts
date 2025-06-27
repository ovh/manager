// eslint-disable-next-line import/no-extraneous-dependencies
import reactPlugin from 'eslint-plugin-react';
// eslint-disable-next-line import/no-extraneous-dependencies
import reactHooksPlugin from 'eslint-plugin-react-hooks';
// eslint-disable-next-line prettier/prettier
import type { ESLint, Linter } from 'eslint';
// eslint-disable-next-line import/no-extraneous-dependencies
import globals from 'globals';

export const reactEslintConfig: Linter.FlatConfig = {
  files: ['**/*.{js,jsx,ts,tsx}'],
  plugins: {
    react: reactPlugin as unknown as ESLint.Plugin,
    'react-hooks': reactHooksPlugin as unknown as ESLint.Plugin,
  },
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
    globals: {
      ...globals.browser,
    },
  },
  settings: {
    react: {
      version: 'detect', // Automatically detect React version
    },
  },
  rules: {
    ...reactPlugin.configs.recommended.rules,
    ...reactHooksPlugin.configs.recommended.rules,

    // https://www.npmjs.com/package/eslint-plugin-react
    // https://www.npmjs.com/package/eslint-plugin-react-hooks
  },
};
