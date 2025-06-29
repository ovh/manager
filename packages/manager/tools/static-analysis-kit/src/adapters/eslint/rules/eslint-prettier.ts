import prettier from 'eslint-plugin-prettier';
import { Linter } from 'eslint';
import { prettierOptions, prettierIgnorePatterns } from '../../../configs/prettier-options.js';

export const prettierEslintConfig: Linter.FlatConfig = {
  files: ['**/*.{ts,tsx,js,jsx,json,yml,yaml,md}'],
  ignores: prettierIgnorePatterns,
  plugins: {
    prettier,
  },
  rules: {
    'prettier/prettier': ['error', prettierOptions, { usePrettierrc: false }],
  },
};
