import { PerfBudgetResult } from '../types/PerfBudget';
import { PerfBudgetScoreLevel, PerfBudgetScoreSummary } from '../types/PerfBudgetScore';

/**
 * Convert status string into a numeric score.
 * @param status - One of "ok" | "near" | "exceed".
 * @returns Numeric score (0–2).
 */
function statusToScore(status: 'ok' | 'near' | 'exceed'): PerfBudgetScoreLevel {
  switch (status) {
    case 'ok':
      return 0;
    case 'near':
      return 1;
    case 'exceed':
      return 2;
  }
}

/**
 * Compute a scored summary for a single app.
 * @param result - Result of performance budget evaluation.
 * @returns ScoreSummary for the app.
 */
export function scorePerfBudget(result: PerfBudgetResult): PerfBudgetScoreSummary {
  const scores = {
    js: statusToScore(result.jsStatus),
    css: statusToScore(result.cssStatus),
    html: statusToScore(result.htmlStatus),
    img: statusToScore(result.imgStatus),
  };

  const totalScore = Object.values(scores).reduce((sum: number, v) => sum + v, 0);

  let status: 'pass' | 'warn' | 'fail';
  if (totalScore === 0) status = 'pass';
  else if (totalScore <= 2) status = 'warn';
  else status = 'fail';

  return {
    app: result.app,
    scores,
    totalScore,
    status,
  };
}

/**
 * Compute scores for multiple apps at once.
 * @param results - List of PerfBudgetResult.
 * @returns List of ScoreSummary.
 */
export function scoreAllPerfBudgets(results: PerfBudgetResult[]): PerfBudgetScoreSummary[] {
  return results.map(scorePerfBudget);
}
