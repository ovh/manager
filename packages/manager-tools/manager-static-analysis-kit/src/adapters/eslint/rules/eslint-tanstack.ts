import pluginQuery from '@tanstack/eslint-plugin-query';
import { Linter } from 'eslint';

import { jsTsFiles } from '../../../configs/file-globs-config';

/**
 * ESLint Flat Config for TanStack Query (React Query).
 *
 * Provides structure for applying TanStack's ruleset to JS/TS files using TanStack Query.
 * Extend this config by explicitly enabling the desired rules.
 *
 * @see https://github.com/TanStack/query/blob/main/docs/eslint/eslint-plugin-query.md
 */
export const tanStackQueryEslintConfig: Linter.FlatConfig = {
  files: [jsTsFiles],
  plugins: {
    '@tanstack/query': pluginQuery,
  },
  rules: {
    ...pluginQuery.configs.recommended.rules,
    // Add rules here as needed, e.g.:
    // '@tanstack/query/exhaustive-deps': 'warn',
    // '@tanstack/query/prefer-query-object-syntax': 'error',
  },
};
