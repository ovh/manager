import type { Linter } from 'eslint';
import eslintPluginBiomeX from 'eslint-plugin-biome-x';

import { allModules } from '../../../configs/file-globs-config';

export const biomeEslintConfig: Linter.FlatConfig = {
  files: [allModules],
  plugins: {
    'biome-x': eslintPluginBiomeX,
  },
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  rules: {
    ...eslintPluginBiomeX.configs.recommended.rules,
    'biome-x/format': [
      'off',
      {
        /** configuation goes here */
      },
    ],
    'biome-x/lint': [
      'error',
      {
        /** configuration goes here and it can be different from above */
      },
    ],
  },
};
