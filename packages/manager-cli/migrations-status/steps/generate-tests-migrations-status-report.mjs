#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { applicationsBasePath, getAvailableApps } from '../../utils/AppUtils.mjs';
import { EXCLUDED_TESTS_DEPS, readPackageJson } from '../../utils/DependenciesUtils.mjs';

const isDryRun = process.argv.includes('--dry-run');
const asJson = process.argv.includes('--json');

const appArgIndex = process.argv.findIndex(arg => arg === '--app');
const appFilter = appArgIndex !== -1 ? process.argv[appArgIndex + 1] : null;

/**
 * Checks whether a given app has partially or fully migrated its Tests setup.
 * @param {string} appName
 * @returns {'✅ Done' | '⚠️ Partial' | '📝 TODO'}
 */
export const getTestMigrationStatus = (appName) => {
  const appPath = path.join(applicationsBasePath, appName);
  const vitestConfigPath = path.join(appPath, 'vitest.config.js');

  let configMigrated = false;
  let scriptsMigrated = false;
  let depsCleaned = true;

  if (fs.existsSync(vitestConfigPath)) {
    const content = fs.readFileSync(vitestConfigPath, 'utf-8');
    configMigrated = content.includes('mergeConfig') && content.includes('@ovh-ux/manager-tests-setup');
    if (isDryRun) {
      console.log(`📄 ${appName}: vitest.config.js → ${configMigrated ? '✅ uses shared config' : '📝 legacy config'}`);
    }
  }

  if (!configMigrated) return '📝 TODO';

  const packageContent = readPackageJson(appPath);
  if (packageContent) {
    const scripts = packageContent.scripts || {};
    scriptsMigrated = Object.values(scripts).some(cmd => cmd.includes('manager-test'));

    const allDeps = { ...packageContent.dependencies, ...packageContent.devDependencies };
    depsCleaned = !EXCLUDED_TESTS_DEPS.some(dep => dep in allDeps);

    if (isDryRun) {
      console.log(`📦 ${appName}: scripts → ${scriptsMigrated ? '✅ manager-test used' : '📝 vitest still used'}`);
      console.log(`📦 ${appName}: dependencies → ${depsCleaned ? '✅ no deprecated deps' : '📝 still has vitest deps'}`);
    }
  }

  return configMigrated && scriptsMigrated && depsCleaned ? '✅ Done' : '⚠️ Partial';
};

/**
 * Generates and prints a Tests migration status table for all applications.
 */
export const generateTestsMigrationsStatusReport = () => {
  const apps = appFilter ? [appFilter] : getAvailableApps();
  const report = apps.map((app) => ({
    Application: app,
    'Tests Migration': getTestMigrationStatus(app),
  }));

  if (asJson) {
    console.log(JSON.stringify(report, null, 2));
    return report;
  }

  console.log('\n📦 Tests Migration Matrix:\n');
  console.table(report);

  const summary = report.reduce((acc, { 'Tests Migration': status }) => {
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  console.log('\n📊 Summary:');
  Object.entries(summary).forEach(([status, count]) => {
    console.log(`  ${status.padEnd(12)}: ${count}`);
  });

  console.log(`
📘 Status Legend:
  ✅ Done         : Fully completed (config + scripts + deps)
  ⚠️ Partial       : Shared config used, but package.json still needs update
  📝 TODO         : Not started

⚠️  Important Notice: These technical improvements apply only to the React application.
`);

  return report;
};

generateTestsMigrationsStatusReport();
