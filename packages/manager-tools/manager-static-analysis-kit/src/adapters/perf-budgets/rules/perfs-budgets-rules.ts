import { assetsBudgetsConfig } from '../../../configs/assets-budgets-config';
import { PerfBudgetResult } from '../types/PerfBudget';

/**
 * Determine status for a given asset size compared to thresholds.
 * @param sizeKb - The actual asset size in KB.
 * @param medianKb - Median value from config.
 * @returns "ok", "near", or "exceed".
 */
export function evaluateAsset(sizeKb: number, medianKb: number): 'ok' | 'near' | 'exceed' {
  const { nearFactor, exceedFactor } = assetsBudgetsConfig.thresholds;

  if (sizeKb > medianKb * exceedFactor) {
    return 'exceed';
  } else if (sizeKb >= medianKb * nearFactor) {
    return 'near';
  }
  return 'ok';
}

/**
 * Evaluate performance budgets for a single app based on asset sizes.
 * @param appReport - Object containing app name and asset sizes (in KB).
 * @returns PerfBudgetResult with statuses for each asset type.
 */
export function evaluatePerfBudgets(appReport: {
  app: string;
  jsKb: number;
  cssKb: number;
  htmlKb: number;
  imgKb: number;
}): PerfBudgetResult {
  return {
    ...appReport,
    jsStatus: evaluateAsset(appReport.jsKb, assetsBudgetsConfig.medians.jsKb),
    cssStatus: evaluateAsset(appReport.cssKb, assetsBudgetsConfig.medians.cssKb),
    htmlStatus: evaluateAsset(appReport.htmlKb, assetsBudgetsConfig.medians.htmlKb),
    imgStatus: evaluateAsset(appReport.imgKb, assetsBudgetsConfig.medians.imgKb),
  };
}
