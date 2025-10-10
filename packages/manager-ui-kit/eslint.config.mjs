// Full adoption
/* import { eslintSharedConfig } from '@ovh-ux/manager-static-analysis-kit';

export default eslintSharedConfig;
*/

// Progressive adoption
/* import { javascriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/javascript';
import { typescriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/typescript';
import { reactEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/react';
import { prettierEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/prettier';
import { a11yEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/a11y';
import {
  complexityJsxTsxConfig,
  complexityTsJsConfig,
} from '@ovh-ux/manager-static-analysis-kit/eslint/complexity';
import { htmlEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/html';
import { cssEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/css';
import { tailwindJsxConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tailwind-jsx';
import { tanStackQueryEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tanstack';
import { importEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/imports';
import { checkFileEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/naming-conventions';
import { vitestEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tests';
import { storybookEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/storybook';

export default [
  javascriptEslintConfig,
  typescriptEslintConfig,
  reactEslintConfig,
  a11yEslintConfig,
  htmlEslintConfig,
  tailwindJsxConfig,
  tanStackQueryEslintConfig,
  ...importEslintConfig,
  ...checkFileEslintConfig,
  vitestEslintConfig,
  prettierEslintConfig,
  complexityJsxTsxConfig,
  complexityTsJsConfig,
  {
    ...cssEslintConfig,
    files: ['**\/*.css', '**\/*.scss'],
  },
  ...storybookEslintConfig,
]; */

// Progressive and disable some rules
/* import { typescriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/typescript';

export default [
  {
    ...typescriptEslintConfig,
    rules: {
      ...typescriptEslintConfig.rules,
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/await-thenable': 'off'
    },
  },
]; */

// Progressive and disable full rules
import { typescriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/typescript';

export default [
  {
    ...typescriptEslintConfig,
    rules: {},
  },
];
