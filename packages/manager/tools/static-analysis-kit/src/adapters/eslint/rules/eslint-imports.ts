import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';
import { Linter } from 'eslint';
import { jsFiles, tsFiles } from '../../../configs/file-globs-config';

// Shared import rules across JS and TS
const sharedImportRules: Record<string, Linter.RuleEntry | undefined> = {
  ...importPlugin.flatConfigs.recommended.rules,
  'import/no-cycle': ['error', {
    maxDepth: Infinity,
    ignoreExternal: false,
    allowUnsafeDynamicCyclicDependency: false,
    disableScc: false,
  }],
  'import/no-dynamic-require': 'warn',
  'import/no-nodejs-modules': 'warn',
};

// JavaScript-specific rules
const jsImportRules: Record<string, Linter.RuleEntry | undefined> = {
  ...sharedImportRules,
  'no-unused-vars': 'warn', // enabled for JS
};

// TypeScript-specific rules
const tsImportRules: Record<string, Linter.RuleEntry | undefined> = {
  ...sharedImportRules,
  'no-unused-vars': 'off', // disabled in favor of TS-aware version
  '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
};

// Final export: ESLint FlatConfig array
export const importEslintConfig: Linter.FlatConfig[] = [
  // JavaScript configuration
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  {
    files: [jsFiles],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: jsImportRules,
  },

  // TypeScript configuration
  ...tseslint.config(
    {
      files: [tsFiles],
      extends: [
        importPlugin.flatConfigs.recommended,
        importPlugin.flatConfigs.typescript,
      ],
      rules: tsImportRules,
      settings: {
        'import/resolver': {
          typescript: {
            alwaysTryTypes: true,
          },
          node: true,
        },
      },
    }
  ),
];
