import { Linter } from 'eslint';
import { complexityRules } from '../../../configs/complexity-config';

export const complexityEslintConfig: Linter.FlatConfig = {
  files: ['**/*.{js,jsx,ts,tsx}'],
  rules: {
    // Cyclomatic complexity (complex branches in a function)
    'complexity': ['warn', complexityRules.maxStatements],

    // Maximum depth of nested blocks
    'max-depth': ['warn', complexityRules.maxDepth],

    // Maximum number of parameters in a function
    'max-params': ['warn', complexityRules.maxParams],

    // Maximum number of nested callbacks
    'max-nested-callbacks': ['warn', complexityRules.maxCallbacks],

    // Maximum number of lines in a file
    'max-lines': ['warn', {
      max: complexityRules.maxLines,
      skipBlankLines: true,
      skipComments: true,
    }],

    // Maximum number of lines per function
    'max-lines-per-function': ['warn', {
      max: complexityRules.maxLinesPerFunction,
      skipBlankLines: true,
      skipComments: true,
      IIFEs: true,
    }],
  },
};
