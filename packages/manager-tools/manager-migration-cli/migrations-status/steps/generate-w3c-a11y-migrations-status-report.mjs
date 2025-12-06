#!/usr/bin/env node
import { getReactApplications } from '../../utils/AppUtils.mjs';
import {
  buildA11yReportFileName,
  buildW3CReportFileName,
  renderReport,
} from '../../utils/ExportUtils.mjs';
import { getMigrationStatusForApp } from '../../utils/ScanUtils.mjs';
import { parseCliArgs } from '../../utils/ScriptUtils.mjs';

const cliArgs = parseCliArgs(process.argv);

if (!cliArgs.type || !['a11y', 'w3c'].includes(cliArgs.type)) {
  console.error('❌ Please provide --type=a11y or --type=w3c');
  process.exit(1);
}

/**
 * Regex definitions
 */
const A11Y_SETUP_IMPORT_RE =
  /import\s+['"]@ovh-ux\/manager-static-analysis-kit\/tests\/html-a11y-tests-setup['"]\s*;?/;
const A11Y_MATCHER_RE = /\btoBeAccessible\s*\(/;

const W3C_SETUP_IMPORT_RE =
  /import\s+['"]@ovh-ux\/manager-static-analysis-kit\/tests\/html-w3c-tests-setup['"]\s*;?/;
const W3C_MATCHER_RE = /\btoBeValidHtml\s*\(/;

/**
 * Status helpers
 */
function getA11yMigrationStatus(app) {
  return getMigrationStatusForApp(app, {
    setupImportRe: A11Y_SETUP_IMPORT_RE,
    matcherRe: A11Y_MATCHER_RE,
    verbose: cliArgs.dryRun,
  });
}

function getW3CMigrationStatus(app) {
  return getMigrationStatusForApp(app, {
    setupImportRe: W3C_SETUP_IMPORT_RE,
    matcherRe: W3C_MATCHER_RE,
    verbose: cliArgs.dryRun,
  });
}

/**
 * Main
 */
async function generateMigrationsStatusReport() {
  let apps = getReactApplications();
  if (cliArgs.app) {
    apps = apps.filter((a) => a === cliArgs.app);
  }

  const report =
    cliArgs.type === 'a11y'
      ? apps.map((app) => ({
          Application: app,
          'A11y Migration': getA11yMigrationStatus(app),
        }))
      : apps.map((app) => ({
          Application: app,
          'W3C Migration': getW3CMigrationStatus(app),
        }));

  renderReport(report, {
    title:
      cliArgs.type === 'a11y' ? 'Follow Up Accessibility (a11y)' : 'Follow Up W3C HTML Validation',
    statusKeys: [cliArgs.type === 'a11y' ? 'A11y Migration' : 'W3C Migration'],
    format: cliArgs.format,
    filename:
      cliArgs.type === 'a11y'
        ? buildA11yReportFileName(cliArgs.format)
        : buildW3CReportFileName(cliArgs.format),
  });
}

generateMigrationsStatusReport().catch((err) => {
  console.error(`❌ Failed to generate ${cliArgs.type} migration report:`, err.message);
  process.exit(1);
});
