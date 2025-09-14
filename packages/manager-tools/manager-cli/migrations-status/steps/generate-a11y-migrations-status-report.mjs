#!/usr/bin/env node
import { getReactApplications } from '../../utils/AppUtils.mjs';
import { buildA11yReportFileName, renderReport } from '../../utils/ExportUtils.mjs';
import { getMigrationStatusForApp } from '../../utils/ScanUtils.mjs';

/**
 * CLI arguments passed after the executable.
 * @type {string[]}
 */
const args = process.argv.slice(2);

/**
 * Whether to run in dry-run mode (verbose logs enabled).
 * @type {boolean}
 */
const isDryRun = args.includes('--dry-run');

/**
 * Extract the output format from CLI args.
 * Supported formats: `json`, `html`. Defaults to console table if omitted.
 * @type {string|null}
 */
const formatArgIndex = args.findIndex((arg) => arg === '--format');
const format = formatArgIndex !== -1 ? args[formatArgIndex + 1] : null;

/**
 * Regex to detect a11y test setup import.
 * Matches:
 * ```js
 * import '@ovh-ux/manager-static-analysis-kit/tests/html-a11y-tests-setup';
 * ```
 * @type {RegExp}
 */
const A11Y_SETUP_IMPORT_RE =
  /import\s+['"]@ovh-ux\/manager-static-analysis-kit\/tests\/html-a11y-tests-setup['"]\s*;?/;

/**
 * Regex to detect usage of the `toBeAccessible` matcher.
 * @type {RegExp}
 */
const A11Y_MATCHER_RE = /\btoBeAccessible\s*\(/;

/**
 * Get the Accessibility (a11y) migration status for a given application.
 *
 * @param {string} app - Name of the React application.
 * @returns {'✅ Done' | '⚠️ Partial' | '📝 TODO'} Migration status.
 */
function getA11yMigrationStatus(app) {
  return getMigrationStatusForApp(app, {
    setupImportRe: A11Y_SETUP_IMPORT_RE,
    matcherRe: A11Y_MATCHER_RE,
    verbose: isDryRun,
  });
}

/**
 * Main entrypoint for the CLI tool.
 * Scans all React apps, computes their a11y migration status, and renders the report.
 *
 * @returns {Promise<void>}
 */
async function generateA11YMigrationsStatusReport() {
  const apps = getReactApplications();

  const report = apps.map((app) => ({
    Application: app,
    'A11y Migration': getA11yMigrationStatus(app),
  }));

  renderReport(report, {
    title: 'Follow Up Accessibility (a11y)',
    statusKeys: ['A11y Migration'],
    format,
    filename: buildA11yReportFileName(format),
  });
}

generateA11YMigrationsStatusReport().catch((err) => {
  console.error('❌ Failed to generate a11y migration report:', err.message);
  process.exit(1);
});
