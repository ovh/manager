import { a11yEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/a11y';
import {
  complexityJsxTsxConfig,
  complexityTsJsConfig,
} from '@ovh-ux/manager-static-analysis-kit/eslint/complexity';
import { htmlEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/html';
import { javascriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/javascript';
import { prettierEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/prettier';
import { reactEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/react';
import { tailwindJsxConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tailwind-jsx';
import { tanStackQueryEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tanstack';
import { vitestEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tests';
import { typescriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/typescript';

export default [
  javascriptEslintConfig,
  {
    ...typescriptEslintConfig,
    rules: {
      ...typescriptEslintConfig.rules,
      '@typescript-eslint/unbound-method': 'off',
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
  {
    ...reactEslintConfig,
    rules: {
      ...reactEslintConfig.rules,
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/refs': 'off',
    },
  },
  a11yEslintConfig,
  htmlEslintConfig,
  {
    ...tailwindJsxConfig,
    rules: {
      ...tailwindJsxConfig.rules,
      'tailwindcss/no-custom-classname': 'off',
      'tailwindcss/no-arbitrary-value': 'off',
    },
  },
  tanStackQueryEslintConfig,
  vitestEslintConfig,
  prettierEslintConfig,
  complexityJsxTsxConfig,
  complexityTsJsConfig,
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
