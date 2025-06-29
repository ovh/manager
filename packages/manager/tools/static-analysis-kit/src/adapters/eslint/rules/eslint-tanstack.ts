import { Linter } from 'eslint';
import pluginQuery from '@tanstack/eslint-plugin-query';
import { jsTsFiles } from '../../../configs/file-globs-config';

export const tanStackQueryEslintConfig: Linter.FlatConfig = {
  files: [jsTsFiles],
  plugins: {
    '@tanstack/query': pluginQuery,
  },
  rules: {
    // https://github.com/TanStack/query/blob/main/docs/eslint/eslint-plugin-query.md#rules
  },
};
