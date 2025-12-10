#!/usr/bin/env node
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';

import { getReactApplications, resolveRoutePath } from '../../utils/AppUtils.mjs';
import { buildRoutesReportFileName, renderReport } from '../../utils/ExportUtils.mjs';
import { parseCliArgs } from '../../utils/ScriptUtils.mjs';

const cliArgs = parseCliArgs(process.argv);

/**
 * Check if an app's route file is migrated to JSX-style.
 */
const getRouteMigrationStatus = async (appName) => {
  const routePath = resolveRoutePath(appName, { verbose: cliArgs.dryRun });
  if (!routePath || !existsSync(routePath)) return '📝 TODO';

  try {
    const content = await readFile(routePath, 'utf-8');
    const migrated = content.includes('<Route') && !content.includes('lazyRouteConfig');
    if (cliArgs.dryRun) {
      console.log(`🔍 ${appName}:`);
      console.log(`   - <Route>: ${content.includes('<Route')}`);
      console.log(`   - lazyRouteConfig: ${content.includes('lazyRouteConfig')}`);
    }
    return migrated ? '✅ Done' : '📝 TODO';
  } catch {
    return '📝 TODO';
  }
};

/**
 * Run migration status analysis and render output.
 */
const generateRoutesMigrationsStatusReport = async () => {
  let apps = getReactApplications();
  if (cliArgs.app) {
    apps = apps.filter((a) => a === cliArgs.app);
  }

  const report = [];
  for (const app of apps) {
    const status = await getRouteMigrationStatus(app);
    report.push({ Application: app, 'Routes Migration': status });
  }

  renderReport(report, {
    title: 'Follow Up Routes Migration',
    statusKeys: ['Routes Migration'],
    format: cliArgs.format,
    filename: buildRoutesReportFileName(cliArgs.format),
  });
};

generateRoutesMigrationsStatusReport().catch((err) => {
  console.error('❌ Failed to generate routes migration report:', err.message);
  process.exit(1);
});
