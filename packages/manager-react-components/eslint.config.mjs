import { defineConfig } from 'eslint/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    extends: compat.extends('../../.eslintrc.js'),
    rules: {
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-shadow': 'off',
      '@typescript-eslint/naming-convention': 'off',
    },
    ignores: ['dist', 'node_modules'],
  },
]);
