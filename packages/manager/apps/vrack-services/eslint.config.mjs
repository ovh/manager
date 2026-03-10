import {
  complexityJsxTsxConfig,
  complexityTsJsConfig,
} from '@ovh-ux/manager-static-analysis-kit/eslint/complexity';
import { reactEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/react';
import { javascriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/javascript';
import { typescriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/typescript';
import { a11yEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/a11y';
import { htmlEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/html';
import { tanStackQueryEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tanstack';
import { importEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/imports';
import { tailwindJsxConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tailwind-jsx';
import { checkFileEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/naming-conventions';
import { vitestEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tests';
import { prettierEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/prettier';
import { cssEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/css';

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
  }
];