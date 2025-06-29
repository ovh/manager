// eslint-disable-next-line import/no-extraneous-dependencies
import tailwindcss from 'eslint-plugin-tailwindcss';
import { Linter } from 'eslint';
import { jsxTsxFiles } from '../../../configs/file-globs-config';

export const tailwindJsxConfig: Linter.FlatConfig = {
  files: [jsxTsxFiles],
  plugins: {
    tailwindcss,
  },
  rules: {
    ...tailwindcss.configs['flat/recommended'].rules,
    // https://www.npmjs.com/package/eslint-plugin-tailwindcss
  },
};
