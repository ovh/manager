import { Linter } from 'eslint';

import { complexityRules } from '../../../configs/complexity-config';
import { jsTsFiles, jsxTsxFiles } from '../../../configs/file-globs-config';

/**
 * Shared complexity rules applied across all file types
 */
const sharedComplexityRules: Linter.RulesRecord = {
  /** Maximum nesting depth of blocks */
  'max-depth': ['warn', complexityRules.maxDepth],

  /** Maximum number of function parameters */
  'max-params': ['warn', complexityRules.maxParams],

  /** Maximum number of nested callbacks */
  'max-nested-callbacks': ['warn', complexityRules.maxCallbacks],
};

/**
 * Complexity rules for TSX/JSX files
 */
export const complexityJsxTsxConfig: Linter.FlatConfig = {
  files: [jsxTsxFiles],
  rules: {
    ...sharedComplexityRules,

    /** Cyclomatic complexity */
    complexity: ['warn', complexityRules.statements.tsxJsx],

    /** Max lines per file */
    'max-lines': [
      'warn',
      {
        max: complexityRules.maxLines,
        skipBlankLines: true,
        skipComments: true,
      },
    ],

    /** Max lines per function */
    'max-lines-per-function': [
      'warn',
      {
        max: complexityRules.linesPerFunction.tsxJsx,
        skipBlankLines: true,
        skipComments: true,
        IIFEs: true,
      },
    ],
  },
};

/**
 * Complexity rules for TS/JS files
 */
export const complexityTsJsConfig: Linter.FlatConfig = {
  files: [jsTsFiles],
  ignores: [jsxTsxFiles],
  rules: {
    ...sharedComplexityRules,

    /** Cyclomatic complexity */
    complexity: ['warn', complexityRules.statements.tsJs],

    /** Max lines per file */
    'max-lines': [
      'warn',
      {
        max: complexityRules.maxLines,
        skipBlankLines: true,
        skipComments: true,
      },
    ],

    /** Max lines per function */
    'max-lines-per-function': [
      'warn',
      {
        max: complexityRules.linesPerFunction.tsJs,
        skipBlankLines: true,
        skipComments: true,
        IIFEs: true,
      },
    ],
  },
};
