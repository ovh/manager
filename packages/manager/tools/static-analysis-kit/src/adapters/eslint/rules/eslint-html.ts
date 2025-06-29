import htmlPlugin from '@html-eslint/eslint-plugin';
import htmlParser from '@html-eslint/parser';
import { ESLint, Linter } from 'eslint';
import { htmlFiles } from '../../../configs/file-globs-config';

export const htmlEslintConfig: Linter.FlatConfig = {
  files: [htmlFiles],
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
