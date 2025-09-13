/**
 * Default configuration for TypeScript coverage checks.
 *
 * Each property maps to a CLI option of `typescript-coverage-report`.
 * See: https://github.com/alexcanessa/typescript-coverage-report
 */
export const typesCoverageConfig = {
  /** Minimum percentage of coverage required (same as `--threshold` or `-t`) */
  threshold: 80,

  /** Output directory for reports (same as `--outputDir` or `-o`) */
  outputDir: 'coverage-ts',

  /** Enable strict mode (same as `--strict` or `-s`) */
  strict: true,

  /** Show debug information (same as `--debug` or `-d`) */
  debug: false,

  /** Enable caching of results (same as `--cache` or `-c`) */
  cache: true,

  /** Path to tsconfig file (same as `--project` or `-p`) */
  project: 'tsconfig.json',

  /** Glob patterns for files to ignore (repeat `--ignore-files` per pattern) */
  ignoreFiles: [
    '**/*.stories.tsx',
    '**/*.stories.ts',
    '**/*.spec.ts',
    '**/*.spec.tsx',
    '**/jest.config.ts',
    '**/vitest.config.*',
    '**/dist/**',
    '**/.generated/**',
  ],

  /** Allow writes to variables with implicit any (same as `--ignore-unread` or `-u`) */
  ignoreUnread: true,

  /**
   * Coverage thresholds for HTML coloring (not passed to CLI).
   * Coverage >= green → good, >= orange → warning, else red.
   */
  thresholds: {
    green: 90,
    orange: 70,
  },

  /**
   * Worst-file drilldown configuration for HTML report.
   */
  worstFiles: {
    /** Show top N worst covered files */
    count: 10,
    /** Show files with coverage strictly below this % */
    threshold: 80,
  },
};
