import { assetsBudgetsConfig } from '../../../configs/assets-budgets-config';
import { ParsedAsset } from './PerfBudgetAssets';
import { PerfBudgetScoreSummary } from './PerfBudgetScore';

/**
 * Result of evaluating performance budgets for a single app.
 */
export interface PerfBudgetResult {
  /** Application name */
  app: string;
  /** JavaScript bundle size in KB */
  jsKb: number;
  /** CSS bundle size in KB */
  cssKb: number;
  /** HTML size in KB */
  htmlKb: number;
  /** Image assets size in KB */
  imgKb: number;

  /** Evaluation status for JS */
  jsStatus: 'ok' | 'near' | 'exceed';
  /** Evaluation status for CSS */
  cssStatus: 'ok' | 'near' | 'exceed';
  /** Evaluation status for HTML */
  htmlStatus: 'ok' | 'near' | 'exceed';
  /** Evaluation status for images */
  imgStatus: 'ok' | 'near' | 'exceed';
}

/**
 * Combined summary of performance budget analysis across all applications.
 *
 * This structure is produced by {@link collectPerfBudgets} and consumed by
 * {@link generatePerfBudgetsHtml}.
 *
 * @property results - Raw per-app evaluation results. Each entry extends
 * {@link PerfBudgetResult} with the full list of parsed {@link ParsedAsset}
 * items from the bundle report.
 *
 * Example result item:
 * ```json
 * {
 *   "app": "manager-catalog-app",
 *   "jsKb": 4533.9,
 *   "cssKb": 790.1,
 *   "htmlKb": 0.8,
 *   "imgKb": 0,
 *   "jsStatus": "exceed",
 *   "cssStatus": "exceed",
 *   "htmlStatus": "ok",
 *   "imgStatus": "ok",
 *   "assets": [
 *     { "filename": "assets/index-Dy08JaXK.js", "type": "js", "sizeKb": 404.9 },
 *     { "filename": "assets/index-BnnLBUth.css", "type": "css", "sizeKb": 790.1 }
 *   ]
 * }
 * ```
 *
 * @property scores - Simplified per-app scoring results, produced by
 * {@link scoreAllPerfBudgets}. Each entry summarizes the numeric scores and
 * overall status (`pass` / `fail`) for a given app.
 *
 * Example score item:
 * ```json
 * {
 *   "app": "manager-catalog-app",
 *   "scores": { "js": 2, "css": 2, "html": 0, "img": 0 },
 *   "totalScore": 4,
 *   "status": "fail"
 * }
 * ```
 *
 * @property medians - Reference HTTP Archive medians (desktop) used as budget
 * thresholds. Taken directly from {@link assetsBudgetsConfig.medians}.
 */
export interface PerfBudgetsSummary {
  results: (PerfBudgetResult & { assets: ParsedAsset[] })[];
  scores: PerfBudgetScoreSummary[];
  medians: typeof assetsBudgetsConfig.medians;
}
