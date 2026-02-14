/* eslint-disable import/no-unresolved */
import { a11yEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/a11y';
import {
  complexityJsxTsxConfig,
  complexityTsJsConfig,
} from '@ovh-ux/manager-static-analysis-kit/eslint/complexity';
import { htmlEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/html';
import { importEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/imports';
import { javascriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/javascript';
import { prettierEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/prettier';
import { reactEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/react';
// import { tailwindJsxConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tailwind-jsx';
import { tanStackQueryEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tanstack';
import { vitestEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tests';
import { typescriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/typescript';

/**
 * NOTE:
 *  We are not importing the shared `complexityRules` from the Static Analysis Kit
 *  because the Manager UI Kit (MUK) requires slightly different thresholds.
 *
 *  Reasoning:
 *   - MUK contains reusable design system primitives and composable hooks,
 *     which naturally have higher function lengths and nested React callbacks.
 *   - We keep alignment with the shared philosophy (readability and maintainability)
 *     but adapt limits to balance strictness and real-world feasibility.
 *
 *  These thresholds still enforce structural discipline but tolerate controlled
 *  complexity in React-heavy components.
 */
const complexityRules = {
  /** Maximum allowed code nesting depth */
  maxDepth: 3,

  /** Maximum number of parameters per function */
  maxParams: 4,

  /** Maximum number of nested callbacks (e.g., Promises, event handlers) */
  maxCallbacks: 3,

  /** Statement complexity limits per file type */
  statements: {
    tsJs: 20, // pure TS/JS modules
    tsxJsx: 50, // JSX/React-heavy modules
  },

  /** Maximum lines allowed per file (excluding blanks/comments) */
  maxLines: 300,

  /** Maximum lines per function (type-dependent) */
  linesPerFunction: {
    tsJs: 50,
    tsxJsx: 250,
  },
};

export default [
  // Base language and framework support
  javascriptEslintConfig,
  typescriptEslintConfig,
  reactEslintConfig,

  // Accessibility and HTML template rules
  a11yEslintConfig,
  htmlEslintConfig,

  // Data fetching and import organization
  tanStackQueryEslintConfig,
  ...importEslintConfig,

  // Testing and formatting
  vitestEslintConfig,
  prettierEslintConfig,

  // Base complexity configs (warn-level from shared package)
  complexityJsxTsxConfig,
  complexityTsJsConfig,

  /* ------------------------------------------------------------------------ */
  /*  MUK Overrides — Enforce Complexity as Hard Errors                     */
  /* ------------------------------------------------------------------------ */
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // Structural constraints
      'max-depth': ['error', complexityRules.maxDepth],
      'max-params': ['error', complexityRules.maxParams],
      'max-nested-callbacks': ['error', complexityRules.maxCallbacks],

      // Logical complexity
      complexity: [
        'error',
        { max: Math.max(complexityRules.statements.tsJs, complexityRules.statements.tsxJsx) },
      ],

      // File-level limits
      'max-lines': [
        'error',
        {
          max: complexityRules.maxLines,
          skipBlankLines: true,
          skipComments: true,
        },
      ],

      // Function-level limits
      'max-lines-per-function': [
        'error',
        {
          max: Math.max(
            complexityRules.linesPerFunction.tsJs,
            complexityRules.linesPerFunction.tsxJsx,
          ),
          skipBlankLines: true,
          skipComments: true,
          IIFEs: true,
        },
      ],
    },
  },

  /* ------------------------------------------------------------------------ */
  /* TailwindCSS Rules                                                     */
  /* ------------------------------------------------------------------------ */
  // tailwindJsxConfig,
  // {
  //   ...tailwindJsxConfig,
  //   rules: {
  //     ...(tailwindJsxConfig.rules ?? {}),
  //     // Disable certain Tailwind validations for consistency with ODS themes
  //     'tailwindcss/classnames-order': 'off',
  //     'tailwindcss/enforces-negative-arbitrary-values': 'off',
  //     'tailwindcss/enforces-shorthand': 'off',
  //     'tailwindcss/migration-from-tailwind-2': 'off',
  //     'tailwindcss/no-arbitrary-value': 'off',
  //     'tailwindcss/no-custom-classname': 'off',
  //     'tailwindcss/no-contradicting-classname': 'off',
  //     'tailwindcss/no-unnecessary-arbitrary-value': 'off',
  //   },
  // },

  /* ------------------------------------------------------------------------ */
  /* Test & Mock Exceptions                                                */
  /* ------------------------------------------------------------------------ */
  {
    files: ['**/__tests__/**', '**/__mocks__/**', '**/__test__/**', '**/react-virtual.ts'],
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'max-nested-callbacks': 'off',
      'max-params': 'off',
      'no-undef': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      'import/named': 'off',
      'react/no-multi-comp': 'off',
    },
  },

  /* ------------------------------------------------------------------------ */
  /*  File Ignored Patterns                                                */
  /* ------------------------------------------------------------------------ */
  {
    ignores: ['**/*.json', '**/*.md'],
  },

  /* ------------------------------------------------------------------------ */
  /*  TypeScript + React Adjustments                                        */
  /* ------------------------------------------------------------------------ */
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'react/prop-types': 'off', 
    },
  },
  {
    files: [
      'src/components/datagrid/useDatagrid.tsx',
      'src/components/datagrid/table/table-body/TableBody.component.tsx'
    ],
    rules: {
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/incompatible-library': 'off',
    },
  },


  /* ------------------------------------------------------------------------ */
  /*  Node JS Configuration Adjustment                                        */
  /* ------------------------------------------------------------------------ */
  {
    files: ['setupTests.ts', 'vite.config.mts', 'vitest.config.js', './scripts/**.mjs'],
    languageOptions: {
      globals: {
        global: 'readonly',
      },
      env: { node: true },
    },
  },
];
