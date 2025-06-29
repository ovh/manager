// eslint-disable-next-line import/no-extraneous-dependencies
import vitest from '@vitest/eslint-plugin';
import { ESLint, Linter } from 'eslint';
import { testFiles } from '../../../configs/file-globs-config';

export const vitestEslintConfig: Linter.FlatConfig = {
  files: testFiles,
  plugins: {
    vitest: (vitest as unknown) as ESLint.Plugin,
  },
  settings: {
    vitest: {
      typecheck: true, // enable this if you're using type-testing in Vitest
    },
  },
  languageOptions: {
    globals: {
      ...vitest.environments.env.globals,
    },
  },
  rules: {
    ...vitest.configs.recommended.rules,

    // https://github.com/vitest-dev/eslint-plugin-vitest?tab=readme-ov-file#rules
  },
};
