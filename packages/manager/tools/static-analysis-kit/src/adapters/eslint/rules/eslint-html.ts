import htmlPlugin from '@html-eslint/eslint-plugin';
import htmlParser from '@html-eslint/parser';
import { ESLint, Linter } from 'eslint';

export const htmlEslintConfig: Linter.FlatConfig = {
  files: ['**/*.html'],
  ignores: [],
  plugins: {
    '@html-eslint': (htmlPlugin as unknown) as ESLint.Plugin,
  },
  languageOptions: {
    parser: htmlParser,
  },
  rules: {
    ...htmlPlugin.configs['flat/recommended'].rules,
    // https://html-eslint.org/docs/rules
  },
};
