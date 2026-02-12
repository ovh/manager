import { Linter } from 'eslint';
import jsxA11y from 'eslint-plugin-jsx-a11y';

import { allModules } from '../../../configs/file-globs-config';

/**
 * Accessibility ESLint configuration using `eslint-plugin-jsx-a11y`.
 *
 * This configuration applies recommended accessibility rules for JSX,
 * and is scoped to all JavaScript and TypeScript modules, including
 * React and modern module formats.
 *
 * @see https://www.npmjs.com/package/eslint-plugin-jsx-a11y
 */
export const a11yEslintConfig: Linter.FlatConfig = {
  files: [allModules],
  plugins: {
    'jsx-a11y': jsxA11y,
  },
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  rules: {
    ...jsxA11y.flatConfigs.recommended.rules,
  },
};
