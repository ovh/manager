#!/usr/bin/env node
import { getAvailableApps } from '../../utils/AppUtils.mjs';
import { buildPnpmReportFileName, renderReport } from '../../utils/ExportUtils.mjs';
import { getPnpmMigrationStatus } from '../../utils/PnpmUtils.mjs';
import { parseCliArgs } from '../../utils/ScriptUtils.mjs';

const cliArgs = parseCliArgs(process.argv);

/**
 * Generates and prints a PNPM migration status table for all applications.
 */
const generatePnpmMigrationsStatusReport = () => {
  let apps = getAvailableApps();
  if (cliArgs.app) {
    apps = apps.filter((app) => app === cliArgs.app);
  }

  const report = apps.map((app) => ({
    Application: app,
    'PNPM Migration': getPnpmMigrationStatus(app, { verbose: cliArgs.dryRun }),
  }));

  renderReport(report, {
    title: 'Follow Up PNPM Migration',
    statusKeys: ['PNPM Migration'],
    format: cliArgs.format,
    filename: buildPnpmReportFileName(cliArgs.format),
  });
};

generatePnpmMigrationsStatusReport();
