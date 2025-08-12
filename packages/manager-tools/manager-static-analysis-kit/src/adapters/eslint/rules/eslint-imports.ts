import js from '@eslint/js';
import { Linter } from 'eslint';
import importPlugin from 'eslint-plugin-import';
import tsEslint from 'typescript-eslint';

import { jsFiles, tsFiles } from '../../../configs/file-globs-config';

/**
 * Shared import-related ESLint rules applied across both JavaScript and TypeScript.
 *
 * Includes cycle detection, discourages dynamic `require`, and disallows usage of core Node.js modules directly.
 */
const sharedImportRules: Record<string, Linter.RuleEntry | undefined> = {
  ...importPlugin.flatConfigs.recommended.rules,
  'import/no-cycle': [
    'error',
    {
      maxDepth: Infinity,
      ignoreExternal: false,
      allowUnsafeDynamicCyclicDependency: false,
      disableScc: false,
    },
  ],
  'import/no-dynamic-require': 'warn',
  'import/no-nodejs-modules': 'warn',
};

/**
 * JavaScript-specific import rules.
 * Enables base `no-unused-vars` since TypeScript version is not in use.
 */
const jsImportRules: Record<string, Linter.RuleEntry | undefined> = {
  ...sharedImportRules,
  'no-unused-vars': 'warn',
};

/**
 * TypeScript-specific import rules.
 * Disables base `no-unused-vars` in favor of the TypeScript-aware variant from `@typescript-eslint`.
 */
const tsImportRules: Record<string, Linter.RuleEntry | undefined> = {
  ...sharedImportRules,
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
};

/**
 * ESLint Flat Config for managing import conventions, cycles, and unused rules
 * for both JavaScript and TypeScript environments.
 *
 * - Uses `eslint-plugin-import` for best practices
 * - Applies proper rules per language
 * - Configures import resolver for TS files
 *
 * @see https://github.com/import-js/eslint-plugin-import
 */
export const importEslintConfig: Linter.FlatConfig[] = [
  // JavaScript configuration block
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

  // TypeScript configuration block
  ...tsEslint.config({
    files: [tsFiles],
    extends: [importPlugin.flatConfigs.recommended, importPlugin.flatConfigs.typescript],
    rules: tsImportRules,
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
        node: true,
      },
    },
  }),
];
