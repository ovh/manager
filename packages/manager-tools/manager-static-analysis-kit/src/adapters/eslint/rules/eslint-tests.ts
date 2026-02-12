import vitest from '@vitest/eslint-plugin';
import { ESLint, Linter } from 'eslint';

import { testFiles } from '../../../configs/file-globs-config';

/**
 * ESLint Flat Config for Vitest testing files.
 *
 * Applies recommended linting rules for Vitest test environments. This includes:
 * - Type-aware linting (when enabled),
 * - Test environment globals (e.g., `describe`, `it`, `expect`),
 * - Best practices and anti-patterns specific to testing.
 *
 * @see https://github.com/vitest-dev/eslint-plugin-vitest#rules
 */
export const vitestEslintConfig: Linter.FlatConfig = {
  files: testFiles,
  plugins: {
    vitest: vitest as unknown as ESLint.Plugin,
  },
  settings: {
    vitest: {
      typecheck: true, // enable type-aware test linting if applicable
    },
  },
  languageOptions: {
    globals: {
      ...vitest.environments.env.globals,
    },
  },
  rules: {
    ...vitest.configs.recommended.rules,
    // You can add specific overrides here as needed
  },
};
