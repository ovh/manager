// import { prettierEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/prettier';

import { javascriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/javascript';
import { typescriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/typescript';
import { reactEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/react';
import { a11yEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/a11y';
import {
  complexityJsxTsxConfig,
  complexityTsJsConfig,
} from '@ovh-ux/manager-static-analysis-kit/eslint/complexity';
import { htmlEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/html';
import { cssEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/css';
import { tailwindJsxConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tailwind-jsx';
import { tanStackQueryEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tanstack';
import { vitestEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tests';
import { tailwindSyntax } from '@eslint/css/syntax';

export default [
  javascriptEslintConfig,
  {
    ...typescriptEslintConfig,
    rules: {
      ...typescriptEslintConfig.rules,
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-redundant-type-constituents': 'warn',
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
      '@tanstack/query/exhaustive-deps': 'warn',
    },
  },
  vitestEslintConfig,
  // prettierEslintConfig,
  complexityJsxTsxConfig,
  complexityTsJsConfig,
  {
    ...cssEslintConfig,
    files: ['**/*.css', '**/*.scss'],
    languageOptions: {
      ...cssEslintConfig.languageOptions,
      customSyntax: tailwindSyntax,
    },
  },
  {
    files: ['**/*.spec.*'],
    rules: {
      'max-nested-callbacks': 'warn',
      'max-lines-per-function': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
    },
  },
  {
    files: ['src/pages/**/*.tsx'],
    rules: {
      // Disable for pages to allow ErrorBoundary export
      'react/no-multi-comp': 'warn',
      'max-lines-per-function': 'warn',
      'max-lines': 'warn',
    },
  },
];
