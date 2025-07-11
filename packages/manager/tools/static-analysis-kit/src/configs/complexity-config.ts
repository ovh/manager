/**
 * Code complexity thresholds for different file types.
 * These values are used to enforce maintainable, readable code.
 */
export const complexityRules = {
  /** Max nesting depth */
  maxDepth: 4,

  /** Max number of function parameters */
  maxParams: 4,

  /** Max nested callbacks */
  maxCallbacks: 3,

  /** Statement limits by file type */
  statements: {
    tsJs: 20,
    tsxJsx: 50,
  },

  /** Lines per file (uniform for all) */
  maxLines: 300,

  /** Lines per function by file type */
  linesPerFunction: {
    tsJs: 50,
    tsxJsx: 250,
  },
};
