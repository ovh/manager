import fs from 'node:fs';
import path from 'node:path';

import { logError, logInfo } from './log-utils.js';

/**
 * Remove old combined report files (JSON & HTML).
 */
export function removeOldCombinedReports(root, dirName, jsonFile, htmlFile) {
  const combinedJson = path.join(root, dirName, jsonFile);
  const combinedHtml = path.join(root, dirName, htmlFile);

  [combinedJson, combinedHtml].forEach((file) => {
    if (fs.existsSync(file)) {
      fs.rmSync(file, { force: true });
      logInfo(`🧹 Removed old combined report ${file}`);
    }
  });
}

/**
 * Generate combined JSON & HTML reports.
 * @param {string} reportRoot - output root
 * @param {string} jsonFile - filename for combined JSON
 * @param {string} htmlFile - filename for combined HTML
 * @param {Function} collectorFn - e.g., collectTsTypesCoverage or collectPerfBudgets
 * @param {Function} htmlGenFn - e.g., generateTsTypesCoverageHtml or generatePerfBudgetsHtml
 */
// eslint-disable-next-line max-params
export function generateCombinedReports(reportRoot, jsonFile, htmlFile, collectorFn, htmlGenFn) {
  try {
    const combinedJsonPath = path.join(reportRoot, jsonFile);
    const combinedHtmlPath = path.join(reportRoot, htmlFile);

    const summary = collectorFn(reportRoot);
    fs.writeFileSync(combinedJsonPath, JSON.stringify(summary, null, 2));
    fs.writeFileSync(combinedHtmlPath, htmlGenFn(summary));
  } catch (err) {
    logError(`❌ Failed to generate combined reports: ${err.message}`);
  }
}
