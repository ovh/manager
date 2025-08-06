import { Linter } from 'eslint';
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
  },
};
