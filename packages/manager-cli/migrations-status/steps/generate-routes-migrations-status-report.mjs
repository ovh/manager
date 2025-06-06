#!/usr/bin/env node

import { getAvailableApps, resolveRoutePath } from '../../utils/AppUtils.mjs';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { renderReport, reportOutputBasePath } from '../../utils/ExportUtils.mjs';

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const formatArgIndex = args.findIndex(arg => arg === '--format');
const format = formatArgIndex !== -1 ? args[formatArgIndex + 1] : null;

const outputFile = format === 'json'
  ? `${reportOutputBasePath}/routes-migration-report.json`
  : format === 'html'
    ? `${reportOutputBasePath}/routes-migration-report.html`
    : null;

/**
 * Check if an app's route file is migrated to JSX-style.
 * @param {string} appName
 * @returns {Promise<'✅ Done' | '📝 TODO'>}
 */
const getRouteMigrationStatus = async (appName) => {
  const routePath = resolveRoutePath(appName, { verbose: isDryRun });
  if (!routePath || !existsSync(routePath)) return '📝 TODO';

  try {
    const content = await fs.readFile(routePath, 'utf-8');
    const migrated = content.includes('<Route') && !content.includes('lazyRouteConfig');
    if (isDryRun) {
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
  const apps = getAvailableApps();
  const report = [];

  for (const app of apps) {
    const status = await getRouteMigrationStatus(app);
    report.push({ Application: app, 'Routes Migration': status });
  }

  renderReport(report, {
    title: 'Routes Migration',
    statusKeys: ['Routes Migration'],
    format,
    filename: outputFile,
  });
};

generateRoutesMigrationsStatusReport().catch((err) => {
  console.error('❌ Failed to generate routes migration report:', err.message);
  process.exit(1);
});
