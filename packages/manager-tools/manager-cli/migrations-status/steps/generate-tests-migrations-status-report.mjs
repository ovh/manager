#!/usr/bin/env node
import { getReactApplications } from '../../utils/AppUtils.mjs';
import { buildTestsReportFileName, renderReport } from '../../utils/ExportUtils.mjs';
import { getTestMigrationStatus } from '../../utils/TestUtils.mjs';

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const formatArgIndex = args.findIndex((arg) => arg === '--format');
const format = formatArgIndex !== -1 ? args[formatArgIndex + 1] : null;

const appArgIndex = args.findIndex((arg) => arg === '--app');
const appFilter = appArgIndex !== -1 ? args[appArgIndex + 1] : null;

/**
 * Generates and prints a Tests migration status table for all applications.
 */
const generateTestsMigrationsStatusReport = () => {
  const apps = appFilter ? [appFilter] : getReactApplications();
  const report = apps.map((app) => ({
    Application: app,
    'Tests Migration': getTestMigrationStatus(app, { verbose: isDryRun }),
  }));

  renderReport(report, {
    title: 'Follow Up Tests Migration',
    statusKeys: ['Tests Migration'],
    format,
    filename: buildTestsReportFileName(format),
  });
};

generateTestsMigrationsStatusReport();
