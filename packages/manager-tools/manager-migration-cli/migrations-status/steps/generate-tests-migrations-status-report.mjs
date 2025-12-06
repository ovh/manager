#!/usr/bin/env node
import { getReactApplications } from '../../utils/AppUtils.mjs';
import { buildTestsReportFileName, renderReport } from '../../utils/ExportUtils.mjs';
import { parseCliArgs } from '../../utils/ScriptUtils.mjs';
import { getTestMigrationStatus } from '../../utils/TestUtils.mjs';

const cliArgs = parseCliArgs(process.argv);

/**
 * Generates and prints a Tests migration status table for all applications.
 */
const generateTestsMigrationsStatusReport = () => {
  let apps = getReactApplications();
  if (cliArgs.app) {
    apps = apps.filter((a) => a === cliArgs.app);
  }

  const report = apps.map((app) => ({
    Application: app,
    'Tests Migration': getTestMigrationStatus(app, { verbose: cliArgs.dryRun }),
  }));

  renderReport(report, {
    title: 'Follow Up Tests Migration',
    statusKeys: ['Tests Migration'],
    format: cliArgs.format,
    filename: buildTestsReportFileName(cliArgs.format),
  });
};

generateTestsMigrationsStatusReport();
