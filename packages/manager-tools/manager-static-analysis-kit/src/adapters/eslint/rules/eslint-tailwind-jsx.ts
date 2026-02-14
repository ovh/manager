import type { Linter } from 'eslint';
import tailwindcss from 'eslint-plugin-tailwindcss';

import { jsxTsxFiles } from '../../../configs/file-globs-config';

/**
 * ESLint Flat Config for Tailwind CSS in JSX/TSX files.
 *
 * Applies `eslint-plugin-tailwindcss` recommended rules to React components using Tailwind.
 *
 * @see https://www.npmjs.com/package/eslint-plugin-tailwindcss
 */
export const tailwindJsxConfig: Linter.FlatConfig = {
  files: [jsxTsxFiles],
  plugins: {
    tailwindcss,
  },
  rules: {
    ...tailwindcss.configs['flat/recommended'].rules,
    'tailwindcss/classnames-order': 'warn',
    'tailwindcss/enforces-negative-arbitrary-values': 'warn',
    'tailwindcss/enforces-shorthand': 'warn',
    'tailwindcss/migration-from-tailwind-2': 'warn',
    'tailwindcss/no-arbitrary-value': 'warn',
    'tailwindcss/no-custom-classname': 'warn',
    'tailwindcss/no-contradicting-classname': 'warn',
    'tailwindcss/no-unnecessary-arbitrary-value': 'warn',
  },
};
