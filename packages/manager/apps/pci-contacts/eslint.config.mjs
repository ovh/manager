import { javascriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/javascript';
import { typescriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/typescript';
import { reactEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/react';
import { prettierEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/prettier';
import { a11yEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/a11y';
import {
  complexityJsxTsxConfig,
  complexityTsJsConfig,
} from '@ovh-ux/manager-static-analysis-kit/eslint/complexity';
import { htmlEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/html';
import { tailwindJsxConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tailwind-jsx';
import { tanStackQueryEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tanstack';
import { vitestEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tests';

export default [
  javascriptEslintConfig,
  {
    ...typescriptEslintConfig,
    rules: {
      ...typescriptEslintConfig.rules,
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@tanstack/query/exhaustive-deps': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  reactEslintConfig,
  a11yEslintConfig,
  htmlEslintConfig,
  tailwindJsxConfig,
  {
    ...tanStackQueryEslintConfig,
    rules: {
      '@tanstack/query/exhaustive-deps': 'off',
    },
  },
  vitestEslintConfig,
  // TODO
  prettierEslintConfig,
  complexityJsxTsxConfig,
  complexityTsJsConfig,
  // cssEslintConfig,
  {
    files: ['**/*.spec.*'],
    rules: {
      'max-nested-callbacks': 'off',
      'max-lines-per-function': 'off',
    },
  },
  {
    files: ['src/pages/**/*.tsx'],
    rules: {
      // Disable for pages to allow ErrorBoundary export
      'react/no-multi-comp': 'off',

      'max-lines-per-function': 'off',
      'max-lines': 'off',
    },
  },
];
