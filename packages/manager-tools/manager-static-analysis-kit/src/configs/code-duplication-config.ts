import { sharedExclusionPatterns } from './shared-exclusion-patterns';

/**
 * Default configuration for Code Duplication checks (jscpd).
 * Doc ref: reporters, output, mode, thresholds, min-lines/tokens, ignore patterns.
 */
export const codeDuplicationConfig = {
  /**
   * jscpd detection sensitivity.
   * Lower values = more matches (noisier), higher = stricter.
   */
  minTokens: 50, // --min-tokens (default jscpd is 50)
  minLines: 5, // --min-lines  (default jscpd is 5)
  maxLines: 2000, // --max-lines
  maxSize: '500kb', // --max-size

  /**
   * Exit threshold (%). If duplication > threshold, jscpd exits non-zero.
   * Keep null to not fail CI; set to e.g. 10 to enforce.
   */
  threshold: null as number | null, // --threshold

  /**
   * mild | weak | strict
   * - 'weak' ignores comments/whitespace; good default for noisy repos.
   */
  mode: 'weak' as 'weak' | 'mild' | 'strict', // --mode

  /**
   * Include absolute paths in reports (helps cross-app linking).
   */
  absolute: true, // --absolute

  /**
   * Formats to analyze; empty = all supported formats.
   * Example: ['javascript','typescript','markup','css']
   */
  formats: [] as string[], // --format

  /**
   * Ignore globs (comma-joined for jscpd).
   */
  ignore: sharedExclusionPatterns,

  /**
   * Reporters we need. html + json are mandatory for our pipeline.
   */
  reporters: ['html', 'json', 'console'],

  /**
   * Show the worst duplicated files per app.
   * threshold: minimum % duplication to be flagged
   * count: max number of files to display
   */
  worstFiles: {
    threshold: 5, // % duplication
    count: 15, // max files
  },

  /**
   * UI coloring thresholds (duplication %). Lower is better:
   * - % < green  -> green
   * - % < orange -> orange
   * - else       -> red
   */
  thresholds: {
    green: 10,
    orange: 20,
  },
};
