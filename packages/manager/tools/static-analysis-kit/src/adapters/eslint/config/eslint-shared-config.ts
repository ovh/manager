import { Linter } from 'eslint';
import { htmlEslintConfig } from '../rules/eslint-html';
import { javascriptEslintConfig } from '../rules/eslint-javascript';
import { typescriptEslintConfig } from '../rules/eslint-typescript';
import { cssEslintConfig } from '../rules/eslint-css';
import { tailwindJsxConfig } from '../rules/eslint-tailwind-jsx';
import { a11yEslintConfig } from '../rules/eslint-a11y';
import { reactEslintConfig } from '../rules/eslint-react';
import { tanStackQueryEslintConfig } from '../rules/eslint-tanstack';
import { vitestEslintConfig } from '../rules/eslint-tests';
import { complexityEslintConfig } from '../rules/eslint-complexity';
import { prettierEslintConfig } from '../rules/eslint-prettier';
import { importEslintConfig } from '../rules/eslint-imports';
import { checkFileEslintConfig } from '../rules/eslint-naming-conventions';

export const eslintSharedConfig: Linter.FlatConfig[] = [
  // Base language configs
  htmlEslintConfig,
  javascriptEslintConfig,
  typescriptEslintConfig,
  cssEslintConfig,

  // Static analysis and extensions
  ...importEslintConfig,
  tailwindJsxConfig,
  a11yEslintConfig,

  // Frameworks and libraries
  reactEslintConfig,
  tanStackQueryEslintConfig,

  // Testing and complexity
  vitestEslintConfig,
  complexityEslintConfig,

  // Code formatting (should always go last)
  prettierEslintConfig,

  // ... other configs
  ...checkFileEslintConfig,
];
