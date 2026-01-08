import { a11yEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/a11y';
import {
  complexityJsxTsxConfig,
  complexityTsJsConfig,
} from '@ovh-ux/manager-static-analysis-kit/eslint/complexity';
import { cssEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/css';
import { htmlEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/html';
import { javascriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/javascript';
import { checkFileEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/naming-conventions';
import { prettierEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/prettier';
import { reactEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/react';
import { tailwindJsxConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tailwind-jsx';
import { tanStackQueryEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tanstack';
import { vitestEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tests';
import { typescriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/typescript';

export default [
  /* ------------------------------------------------------------------------ */
  /* Basic Rules                                                              */
  /* ------------------------------------------------------------------------ */
  {
    ...typescriptEslintConfig,
    rules: {
      ...(typescriptEslintConfig.rules ?? {}),
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_+$',
          varsIgnorePattern: '^_+$',
        },
      ],
    },
  },
  javascriptEslintConfig,
  reactEslintConfig,
  prettierEslintConfig,
  tanStackQueryEslintConfig,
  htmlEslintConfig,
  {
    rules: {
      'react/no-multi-comp': 'off',
      'no-console': ['error', { allow: ['error'] }],
    },
  },
  /* ------------------------------------------------------------------------ */
  /* TailwindCSS Rules                                                        */
  /* ------------------------------------------------------------------------ */
  tailwindJsxConfig,
  {
    ...tailwindJsxConfig,
    rules: {
      ...(tailwindJsxConfig.rules ?? {}),
      // Current plugin config requires that we set rules to warn to activate them
      'tailwindcss/classnames-order': 'warn',
      'tailwindcss/enforces-negative-arbitrary-values': 'warn',
      'tailwindcss/enforces-shorthand': 'warn',
      'tailwindcss/migration-from-tailwind-2': 'warn',
      'tailwindcss/no-contradicting-classname': 'warn',
      'tailwindcss/no-arbitrary-value': 'off',
      'tailwindcss/no-custom-classname': 'off',
      'tailwindcss/no-unnecessary-arbitrary-value': 'off',
    },
  },
  /* ------------------------------------------------------------------------ */
  /* Vitest Rules                                                             */
  /* ------------------------------------------------------------------------ */
  {
    ...vitestEslintConfig,
    rules: {
      ...(vitestEslintConfig.rules ?? {}),
      'vitest/expect-expect': [
        'error',
        {
          assertFunctionNames: ['expect*', 'assert*'],
        },
      ],
    },
  },
  /* ------------------------------------------------------------------------ */
  /* Complexity Rules                                                         */
  /* ------------------------------------------------------------------------ */
  complexityJsxTsxConfig,
  complexityTsJsConfig,
  {
    rules: {
      'max-lines-per-function': 'off',
      'max-lines': 'off',
      'max-nested-callbacks': 'off',
    },
  },
  /* ------------------------------------------------------------------------ */
  /* A11y Rules                                                               */
  /* ------------------------------------------------------------------------ */
  {
    ...a11yEslintConfig,
    ignores: ['**/*.spec.tsx'],
  },
  /* ------------------------------------------------------------------------ */
  /* Css Rules                                                                */
  /* ------------------------------------------------------------------------ */
  cssEslintConfig,
  {
    rules: {
      'css/no-invalid-at-rules': 'off',
      'css/no-invalid-at-rule-placement': 'off',
      'css/no-invalid-properties': 'off',
    },
  },
  /* ------------------------------------------------------------------------ */
  /* Naming Conventions Rules                                                 */
  /* ------------------------------------------------------------------------ */
  ...checkFileEslintConfig,
  {
    rules: {
      'check-file/folder-match-with-fex': 'off',
      'check-file/filename-naming-convention': 'off',
      'check-file/folder-naming-convention': 'off',
      'check-file/no-index': 'off',
    },
  },
];
