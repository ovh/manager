// eslint-disable-next-line import/no-extraneous-dependencies
import jsxA11y from 'eslint-plugin-jsx-a11y';
import { Linter } from 'eslint';
import { allModules } from '../../../configs/file-globs-config';

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
    // https://www.npmjs.com/package/eslint-plugin-jsx-a11y
  },
};
