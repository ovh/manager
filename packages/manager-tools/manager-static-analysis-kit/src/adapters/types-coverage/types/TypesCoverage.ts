/**
 * Expected structure of raw `typescript-coverage.json` files.
 *
 * Top-level stats may be missing in some cases, but `fileCounts` is expected
 * to contain per-file results with `correctCount` and `totalCount`.
 */
export interface RawCoverageReport {
  percentage?: number;
  total?: number;
  covered?: number;
  uncovered?: number;
  fileCounts?: Record<
    string,
    {
      correctCount: number;
      totalCount: number;
    }
  >;
}

/**
 * Normalized per-file coverage entry used in reports.
 */
export interface FileCoverage {
  covered: number;
  total: number;
  percentage: number;
}

/** Tuple of [filename, coverage] for worst-file drilldown. */
export type WorstFileEntry = [string, FileCoverage];

/**
 * Manual "loose types" statistics collected by scanning `src/` files.
 */
export interface LooseTypesSummary {
  as: number;
  any: number;
  unknown: number;
}

/**
 * Shape of a single app's aggregated coverage summary.
 */
export interface AppCoverageSummary {
  covered: number;
  total: number;
  percentage: number;
  minPercentage?: number;
  maxPercentage?: number;
  error?: string;

  /** Pre-filtered worst files (below threshold). */
  worstFiles?: WorstFileEntry[];

  /** Manual loose type usage */
  looseTypes?: LooseTypesSummary;
}

/**
 * Shape of the combined coverage summary across all apps.
 */
export interface CoverageSummary {
  apps: Record<string, AppCoverageSummary>;
  totalCovered: number;
  totalTypes: number;
  percentage: number;
}
