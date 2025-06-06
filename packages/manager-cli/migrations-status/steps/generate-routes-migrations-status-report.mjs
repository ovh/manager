#!/usr/bin/env node

import fs from 'fs/promises';
import { existsSync, statSync, readdirSync } from 'fs';
import { join } from 'path';
import { applicationsBasePath, resolveRoutePath } from '../../utils/AppUtils.mjs';

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run'); // verbose mode enabled implicitly

/**
 * Get the list of available apps by filtering valid directories.
 * @returns {string[]}
 */
const getAvailableApps = () => {
  if (!existsSync(applicationsBasePath)) {
    console.error(`❌ Directory not found: ${applicationsBasePath}`);
    return [];
  }

  const apps = readdirSync(applicationsBasePath).filter((name) => {
    const fullPath = join(applicationsBasePath, name);
    try {
      return statSync(fullPath).isDirectory();
    } catch {
      return false;
    }
  });

  if (isDryRun) {
    console.log(`🗂 Found ${apps.length} applications:`);
    apps.forEach((app) => console.log(`   - ${app}`));
  }

  return apps;
};

/**
 * Check if an app's route file is migrated to JSX-style.
 * @param {string} appName
 * @returns {Promise<'✅ Done' | '📝 TODO'>}
 */
const getRouteMigrationStatus = async (appName) => {
  const path = resolveRoutePath(appName, { verbose: isDryRun });
  if (!path) return '📝 TODO';

  try {
    const content = await fs.readFile(path, 'utf-8');
    const migrated =
      content.includes('<Route') &&
      !content.includes('lazyRouteConfig')

    if (isDryRun) {
      console.log(`🔍 ${appName}`);
      console.log(`   - <Route: ${content.includes('<Route')}`);
      console.log(`   - lazyRouteConfig: ${content.includes('lazyRouteConfig')}`);
      console.log(`   - export default: ${content.includes('export default')}`);
    }

    return migrated ? '✅ Done' : '📝 TODO';
  } catch (err) {
    console.warn(`⚠️ Could not read route file for ${appName}: ${err.message}`);
    return '📝 TODO';
  }
};

/**
 * Run migration status analysis and render table.
 */
const generateRoutesMigrationsStatusReport = async () => {
  const apps = getAvailableApps();
  const report = [];

  for (const app of apps) {
    const status = await getRouteMigrationStatus(app);
    report.push({ Application: app, 'Routes Migration': status });
  }

  console.log('\n📦 Technical Improvements Matrix:\n');
  console.table(report);

  // Summary
  const summary = report.reduce((acc, { 'Routes Migration': status }) => {
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  console.log('\n📊 Summary:');
  Object.entries(summary).forEach(([status, count]) => {
    console.log(`  ${status.padEnd(12)}: ${count}`);
  });

  console.log(`
📘 Status Legend:
  ✅ Done         : Fully completed
  📝 TODO         : Not started

⚠️  Important Notice: These technical improvements apply only to the React application.
`);
};

generateRoutesMigrationsStatusReport().catch((err) => {
  console.error('❌ Failed to generate routes migration report:', err.message);
  process.exit(1);
});
