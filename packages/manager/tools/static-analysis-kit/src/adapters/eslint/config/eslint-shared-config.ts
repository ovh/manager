import { Linter } from 'eslint';
import { htmlEslintConfig } from '../rules/eslint-html';
import { typescriptEslintConfig } from '../rules/eslint-typescript';
import { javascriptEslintConfig } from '../rules/eslint-javascript';
import { cssEslintConfig } from '../rules/eslint-css';
import { tailwindJsxConfig } from '../rules/eslint-tailwind-jsx';
import { a11yEslintConfig } from '../rules/eslint-a11y';
import { reactEslintConfig } from '../rules/eslint-react';
import { vitestEslintConfig } from '../rules/eslint-tests';
import { complexityEslintConfig } from '../rules/eslint-complexity';
import { tanStackQueryEslintConfig } from '../rules/eslint-tanstack';

export const eslintSharedConfig: Linter.FlatConfig[] = [
  htmlEslintConfig,
  javascriptEslintConfig,
  typescriptEslintConfig,
  cssEslintConfig,
  tailwindJsxConfig,
  a11yEslintConfig,
  reactEslintConfig,
  vitestEslintConfig,
  complexityEslintConfig,
  tanStackQueryEslintConfig,
];
