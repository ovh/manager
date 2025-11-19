/*
## Remaining rules ##

import {
  complexityJsxTsxConfig,
  complexityTsJsConfig,
} from '@ovh-ux/manager-static-analysis-kit/eslint/complexity';
import { cssEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/css';
import { checkFileEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/naming-conventions';
import { importEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/imports';
*/
import { a11yEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/a11y';
import { htmlEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/html';
import { javascriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/javascript';
import { prettierEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/prettier';
import { reactEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/react';
import { tailwindJsxConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tailwind-jsx';
import { tanStackQueryEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tanstack';
import { vitestEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tests';
import { typescriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/typescript';

export default [
  typescriptEslintConfig,
  javascriptEslintConfig,
  reactEslintConfig,
  prettierEslintConfig,
  tanStackQueryEslintConfig,
  htmlEslintConfig,
  {
    ...a11yEslintConfig,
    ignores: ['**/*.spec.tsx'],
  },
  {
    rules: {
      '@typescript-eslint/no-misused-promises': 'off',
      'react/no-multi-comp': 'off',
    },
  },
  /* ------------------------------------------------------------------------ */
  /* TailwindCSS Rules                                                     */
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
  /* Vitest Rules                                                     */
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
];
