/**
 * Code complexity thresholds used to enforce maintainable and readable code.
 * These values are typically enforced via ESLint core rules or community plugins.
 *
 * @see https://eslint.org/docs/latest/rules/
 */
export const complexityRules = {
  /**
   * Maximum allowed nesting depth of blocks (e.g., if, for, while).
   * @see https://eslint.org/docs/latest/rules/max-depth
   */
  maxDepth: 4,

  /**
   * Maximum number of parameters allowed in function definitions.
   * Helps avoid overly complex APIs.
   * @see https://eslint.org/docs/latest/rules/max-params
   */
  maxParams: 4,

  /**
   * Maximum number of nested callbacks allowed.
   * Helps detect "callback hell" patterns.
   * Typically used with custom rules or code complexity plugins.
   */
  maxCallbacks: 3,

  /**
   * Maximum number of statements allowed in a function.
   * Encourages smaller, more modular functions.
   * @see https://eslint.org/docs/latest/rules/max-statements
   */
  maxStatements: 20,

  /**
   * Maximum number of lines allowed per file.
   * Helps split large files into smaller, more maintainable units.
   * @see https://eslint.org/docs/latest/rules/max-lines
   */
  maxLines: 300,

  /**
   * Maximum number of lines allowed per function/method.
   * Useful to catch long functions that could be decomposed.
   * @see https://eslint.org/docs/latest/rules/max-lines-per-function
   */
  maxLinesPerFunction: 50,
};
