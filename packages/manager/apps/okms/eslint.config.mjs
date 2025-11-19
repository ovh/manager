/*
## Full adoption ##
import { eslintSharedConfig } from '@ovh-ux/manager-static-analysis-kit';

export default eslintSharedConfig;


## Progressive adoption ##
import { typescriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/typescript';
import { javascriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/javascript';
import { reactEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/react';
import { prettierEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/prettier';

import {
  complexityJsxTsxConfig,
  complexityTsJsConfig,
} from '@ovh-ux/manager-static-analysis-kit/eslint/complexity';
import { cssEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/css';
import { htmlEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/html';
import { importEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/imports';
import { checkFileEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/naming-conventions';
import { tanStackQueryEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tanstack';
import { vitestEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tests';
*/
import { a11yEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/a11y';
import { javascriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/javascript';
import { prettierEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/prettier';
import { reactEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/react';
import { tailwindJsxConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tailwind-jsx';
import { typescriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/typescript';

export default [
  typescriptEslintConfig,
  javascriptEslintConfig,
  reactEslintConfig,
  prettierEslintConfig,
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
];
