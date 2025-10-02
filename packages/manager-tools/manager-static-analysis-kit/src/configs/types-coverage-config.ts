import { sharedTypesExclusionPatterns } from './shared-exclusion-patterns';

/**
 * Default configuration for TypeScript coverage checks.
 *
 * Each property maps to a CLI option of `typescript-coverage-report`.
 * See: https://github.com/alexcanessa/typescript-coverage-report
 */
export const typesCoverageConfig = {
  /** Minimum percentage of coverage required (same as `--threshold` or `-t`) */
  threshold: 60,

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
  ignoreFiles: sharedTypesExclusionPatterns,

  /** Allow writes to variables with implicit any (same as `--ignore-unread` or `-u`) */
  ignoreUnread: false,

  /**
   * Coverage thresholds for HTML coloring (not passed to CLI).
   * Coverage >= green → good, >= orange → warning, else red.
   */
  thresholds: {
    green: 80,
    orange: 60,
  },

  /**
   * Thresholds for manual loose types (as/any/unknown).
   * Count <= green → good, <= orange → warning, else red.
   */
  looseThresholds: {
    as: { green: 0, orange: 50 },
    any: { green: 0, orange: 5 },
    unknown: { green: 0, orange: 20 },
  },

  /**
   * Worst-file drilldown configuration for HTML report.
   */
  worstFiles: {
    /** Show top N worst covered files */
    count: 15,
    /** Show files with coverage strictly below this % */
    threshold: 100,
  },
};
