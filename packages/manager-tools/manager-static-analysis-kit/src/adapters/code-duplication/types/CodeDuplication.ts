/**
 * Summary of code duplication for a single application.
 * Values are absolute counts except {@link percentage}, which is 0–100.
 */
export interface AppCodeDuplicationSummary {
  /** Total number of source lines scanned for this app. */
  totalLines: number;

  /** Total number of lexical tokens scanned for this app. */
  totalTokens: number;

  /** Number of duplicated lines detected in this app. */
  duplicateLines: number;

  /** Number of duplicated tokens detected in this app. */
  duplicateTokens: number;

  /**
   * Percentage of duplicated lines over total lines, in the range [0, 100].
   * If not provided by the report, it is computed as duplicateLines / totalLines * 100.
   */
  percentage: number;

  /**
   * Number of clone groups (a.k.a. "clones") reported by the detector
   * for this app. A clone group can involve multiple files/regions.
   */
  clonesCount: number;

  /**
   * Optional error message if the app’s report could not be parsed or aggregated.
   * When present, other numeric fields may be zeroed.
   */
  error?: string;

  /**
   * List of the worst duplicated files for this app (sorted and thresholded).
   * Computed from the `duplicates` array in the jscpd JSON report.
   */
  worstFiles?: WorstCodeDuplicationFile[];
}

/**
 * Aggregated code-duplication view across all applications.
 */
export interface CombinedCodeDuplicationSummary {
  /**
   * Per-application duplication summaries keyed by application name
   * (typically the directory name holding the app’s report).
   */
  apps: Record<string, AppCodeDuplicationSummary>;

  /** Total number of lines across all apps. */
  totalLines: number;

  /** Total number of tokens across all apps. */
  totalTokens: number;

  /** Sum of duplicated lines across all apps. */
  totalDuplicateLines: number;

  /** Sum of duplicated tokens across all apps. */
  totalDuplicateTokens: number;

  /**
   * Overall duplicated-lines percentage across all apps, in [0, 100].
   * Usually computed as totalDuplicateLines / totalLines * 100.
   */
  percentage: number;
}

/**
 * Tuple describing a single file’s duplication stats.
 *
 * - index 0: absolute or relative file path
 * - index 1: duplication stats for that file
 *
 * @example
 * const worst: WorstCodeDuplicationFile = [
 *   "src/components/Button.tsx",
 *   { duplicatedLines: 120, totalLines: 600, percentage: 20 }
 * ];
 */
export type WorstCodeDuplicationFile = [
  string,
  {
    /** Number of duplicated lines found in this file. */
    duplicatedLines: number;

    /** Total number of lines in this file (real count or a safe estimate). */
    totalLines: number;

    /** Duplicated-lines ratio for this file, in [0, 100]. */
    percentage: number;
  },
];

/**
 * Stats for a single file’s duplication (useful when not paired with a path).
 */
export interface WorstFileStats {
  /** Number of duplicated lines found in this file. */
  duplicatedLines: number;

  /** Total number of lines in this file. */
  totalLines: number;

  /** Duplicated-lines ratio for this file, in [0, 100]. */
  percentage: number;
}

/**
 * One side (file & location) of a reported duplicate block in a jscpd v4 report.
 */
interface JscpdDuplicateSide {
  /** Absolute or relative path to the file containing the duplicated block. */
  name: string;

  /**
   * 1-based line index where the duplicated block starts in this file.
   * May be absent depending on reporter settings.
   */
  startLoc?: { line?: number };

  /**
   * 1-based line index where the duplicated block ends in this file.
   * May be absent depending on reporter settings.
   */
  endLoc?: { line?: number };
}

/**
 * A single duplicate pair/group entry reported by jscpd v4.
 */
interface JscpdDuplicate {
  /**
   * Number of lines participating in this duplicate block
   * (applies to both sides).
   */
  lines: number;

  /** First occurrence of the duplicated block. */
  firstFile: JscpdDuplicateSide;

  /** Second occurrence of the duplicated block. */
  secondFile: JscpdDuplicateSide;
}

/**
 * Minimal jscpd v4 JSON schema used by the aggregation logic.
 * Only fields referenced by our code are included here.
 */
export interface JscpdReportV4 {
  /**
   * Aggregated totals reported by jscpd.
   * Note: some reporters omit {@link statistics.total.percentage}.
   */
  statistics?: {
    total?: {
      /** Total number of lines analyzed. */
      lines?: number;

      /** Total number of tokens analyzed. */
      tokens?: number;

      /** Total number of duplicated lines. */
      duplicatedLines?: number;

      /** Total number of duplicated tokens. */
      duplicatedTokens?: number;

      /** Number of clone groups detected. */
      clones?: number;

      /**
       * Duplicated-lines percentage, in [0, 100].
       * If absent, compute as duplicatedLines / lines * 100.
       */
      percentage?: number;
    };
  };

  /**
   * List of duplicate entries (pairs/blocks) detected by jscpd.
   * This array is the source of truth for computing per-file stats.
   */
  duplicates?: JscpdDuplicate[];
}
