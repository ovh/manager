/**
 * Numeric score levels for statuses.
 * - ok = 0
 * - near = 1
 * - exceed = 2
 */
export type PerfBudgetScoreLevel = 0 | 1 | 2;

/**
 * Summary of scores for an app across all assets.
 */
export interface PerfBudgetScoreSummary {
  /** Application name */
  app: string;
  /** Scores per asset type */
  scores: {
    js: PerfBudgetScoreLevel;
    css: PerfBudgetScoreLevel;
    html: PerfBudgetScoreLevel;
    img: PerfBudgetScoreLevel;
  };
  /** Total score (sum of all assets) */
  totalScore: number;
  /** Overall status: pass | warn | fail */
  status: 'pass' | 'warn' | 'fail';
}
