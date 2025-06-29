import { Linter } from 'eslint';
import { complexityRules } from '../../../configs/complexity-config';
import { jsTsFiles } from '../../../configs/file-globs-config';

/**
 * Complexity-related ESLint rules configuration.
 *
 * Enforces boundaries on code complexity to ensure maintainability and readability.
 * Includes rules for cyclomatic complexity, nested blocks, parameters,
 * lines per function, and overall file length.
 *
 * Applies to all JavaScript and TypeScript files.
 *
 * @see https://eslint.org/docs/latest/rules/
 */
export const complexityEslintConfig: Linter.FlatConfig = {
  files: [jsTsFiles],
  rules: {
    /** Cyclomatic complexity: limits number of decision points in a function */
    'complexity': ['warn', complexityRules.maxStatements],

    /** Maximum nesting depth of blocks */
    'max-depth': ['warn', complexityRules.maxDepth],

    /** Maximum number of function parameters */
    'max-params': ['warn', complexityRules.maxParams],

    /** Maximum number of nested callbacks */
    'max-nested-callbacks': ['warn', complexityRules.maxCallbacks],

    /** Maximum lines per file, ignoring blank lines and comments */
    'max-lines': ['warn', {
      max: complexityRules.maxLines,
      skipBlankLines: true,
      skipComments: true,
    }],

    /** Maximum lines per function, ignoring blank lines, comments, and IIFEs */
    'max-lines-per-function': ['warn', {
      max: complexityRules.maxLinesPerFunction,
      skipBlankLines: true,
      skipComments: true,
      IIFEs: true,
    }],
  },
};
