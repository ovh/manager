// eslint-disable-next-line import/no-extraneous-dependencies
import tailwindcss from 'eslint-plugin-tailwindcss';
import { Linter } from 'eslint';

export const tailwindJsxConfig: Linter.FlatConfig = {
  files: ['**/*.{jsx,tsx}'],
  plugins: {
    tailwindcss,
  },
  rules: {
    ...tailwindcss.configs['flat/recommended'].rules,
    // https://www.npmjs.com/package/eslint-plugin-tailwindcss
  },
};
