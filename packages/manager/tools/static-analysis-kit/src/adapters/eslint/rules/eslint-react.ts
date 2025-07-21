import { ESLint, Linter } from 'eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';

import { jsTsFiles } from '../../../configs/file-globs-config';

/**
 * ESLint Flat Config for React and React Hooks.
 * This configuration applies:
 * - Recommended React rules from `eslint-plugin-react`
 * - Recommended rules for hooks from `eslint-plugin-react-hooks`
 * - JSX support via `parserOptions.ecmaFeatures.jsx`
 * - Browser global variables (e.g., `window`, `document`)
 * - Auto-detect React version for compatibility
 *
 * @see https://www.npmjs.com/package/eslint-plugin-react
 * @see https://www.npmjs.com/package/eslint-plugin-react-hooks
 */
export const reactEslintConfig: Linter.FlatConfig = {
  files: [jsTsFiles],
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
      version: 'detect',
    },
  },
  rules: {
    ...reactPlugin.configs.recommended.rules,

    // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/react-in-jsx-scope.md#when-not-to-use-it
    ...reactPlugin.configs['jsx-runtime'].rules,

    ...reactHooksPlugin.configs.recommended.rules,

    // Enforce only one component per file (stateless included)
    // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-multi-comp.md
    'react/no-multi-comp': ['error', { ignoreStateless: false }],
  },
};
