import { Linter } from 'eslint';
import pluginQuery from '@tanstack/eslint-plugin-query';

export const tanStackQueryEslintConfig: Linter.FlatConfig = {
  files: ['**/*.{ts,tsx,js,jsx}'],
  plugins: {
    '@tanstack/query': pluginQuery,
  },
  rules: {
    // https://github.com/TanStack/query/blob/main/docs/eslint/eslint-plugin-query.md#rules
  },
};
