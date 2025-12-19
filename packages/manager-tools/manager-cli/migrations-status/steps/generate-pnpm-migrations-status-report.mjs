#!/usr/bin/env node
import { getAvailableApps } from '../../utils/AppUtils.mjs';
import { buildPnpmReportFileName, renderReport } from '../../utils/ExportUtils.mjs';
import { getAllModules } from '../../utils/ModuleUtils.mjs';
import { getPnpmMigrationStatus } from '../../utils/PnpmUtils.mjs';
import { parseCliArgs } from '../../utils/ScriptUtils.mjs';

const cliArgs = parseCliArgs(process.argv);

/**
 * Generates and prints a PNPM migration status table for all applications.
 */
const generatePnpmMigrationsStatusReport = () => {
  const applications = getAvailableApps();
  const commonModules = getAllModules();

  const applicationReports = applications.map((appName) => ({
    Application: `${appName} (Application)`,
    'PNPM Migration': getPnpmMigrationStatus(appName, `packages/manager/apps`, {
      verbose: cliArgs.dryRun,
    }),
  }));

  const commonModulesReports = commonModules.map((commonModule) => ({
    Application: `${commonModule.moduleName} (Module)`,
    'PNPM Migration': getPnpmMigrationStatus(commonModule.moduleName, commonModule.moduleBasePath, {
      verbose: cliArgs.dryRun,
    }),
  }));

  const pnpmMigrationReports = [...applicationReports, ...commonModulesReports];

  renderReport(pnpmMigrationReports, {
    title: 'Follow-Up PNPM Migration',
    statusKeys: ['PNPM Migration'],
    format: cliArgs.format,
    filename: buildPnpmReportFileName(cliArgs.format),
  });
};

generatePnpmMigrationsStatusReport();
