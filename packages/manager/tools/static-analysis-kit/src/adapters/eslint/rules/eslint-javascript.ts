import { Linter } from 'eslint';
// eslint-disable-next-line import/no-extraneous-dependencies
import js from '@eslint/js';

export const javascriptEslintConfig: Linter.FlatConfig = {
  files: ['**/*.js', '**/*.jsx'],
  ignores: [],
  languageOptions: {
    ...js.languageOptions,
    sourceType: 'module',
  },
  plugins: js.plugins,
  rules: {
    ...js.configs.recommended.rules,
    // https://eslint.org/docs/latest/rules/
  },
};
