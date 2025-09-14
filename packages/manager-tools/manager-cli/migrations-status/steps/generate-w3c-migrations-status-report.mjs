#!/usr/bin/env node
import { getReactApplications } from '../../utils/AppUtils.mjs';
import { buildW3CReportFileName, renderReport } from '../../utils/ExportUtils.mjs';
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
 * Regex to detect W3C test setup import.
 * Matches:
 * ```js
 * import '@ovh-ux/manager-static-analysis-kit/tests/html-w3c-tests-setup';
 * ```
 * @type {RegExp}
 */
const W3C_SETUP_IMPORT_RE =
  /import\s+['"]@ovh-ux\/manager-static-analysis-kit\/tests\/html-w3c-tests-setup['"]\s*;?/;

/**
 * Regex to detect usage of the `toBeValidHtml` matcher.
 * @type {RegExp}
 */
const W3C_MATCHER_RE = /\btoBeValidHtml\s*\(/;

/**
 * Get the W3C migration status for a given application.
 *
 * @param {string} app - Name of the React application.
 * @returns {'✅ Done' | '⚠️ Partial' | '📝 TODO'} Migration status.
 */
function getW3CMigrationStatus(app) {
  return getMigrationStatusForApp(app, {
    setupImportRe: W3C_SETUP_IMPORT_RE,
    matcherRe: W3C_MATCHER_RE,
    verbose: isDryRun,
  });
}

/**
 * Main entrypoint for the CLI tool.
 * Scans all React apps, computes their W3C migration status, and renders the report.
 *
 * @returns {Promise<void>}
 */
async function generateW3CMigrationsStatusReport() {
  const apps = getReactApplications();

  const report = apps.map((app) => ({
    Application: app,
    'W3C Migration': getW3CMigrationStatus(app),
  }));

  renderReport(report, {
    title: 'Follow Up W3C HTML Validation',
    statusKeys: ['W3C Migration'],
    format,
    filename: buildW3CReportFileName(format),
  });
}

generateW3CMigrationsStatusReport().catch((err) => {
  console.error('❌ Failed to generate W3C migration report:', err.message);
  process.exit(1);
});
