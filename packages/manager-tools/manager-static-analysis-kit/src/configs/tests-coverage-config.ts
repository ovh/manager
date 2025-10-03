/**
 * Configuration for test coverage reporting.
 *
 * Defines how coverage is analyzed, including thresholds and
 * the selection of the least-covered files per application.
 */
export const testsCoverageConfig = {
  worstFiles: {
    /**
     * Which coverage bucket to rank by.
     * Possible values: 'lines' | 'branches' | 'functions' | 'statements'.
     */
    metric: 'lines' as const,

    /**
     * Only include files below this percentage threshold (0–100).
     */
    threshold: 60,

    /**
     * Number of least-covered files to report per app.
     */
    count: 15,
  },

  /**
   * Threshold factors for test coverage evaluation.
   * Coverage above `green` is considered healthy,
   * between `orange` and `green` is a warning zone,
   * and below `orange` is considered poor.
   */
  thresholds: {
    green: 80,
    orange: 60,
  },
};
