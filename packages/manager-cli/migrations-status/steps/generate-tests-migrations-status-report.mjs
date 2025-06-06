import fs from 'fs';
import path from 'path';
import { applicationsBasePath, getAvailableApps, EXCLUDED_TESTS_DEPS } from '../../utils/AppUtils.mjs';

const isDryRun = process.argv.includes('--dry-run');

/**
 * Checks whether a given app has partially or fully migrated its Tests setup:
 * - ✅ Done       → config + scripts + clean deps
 * - ⚠️ Partial     → config migrated, but scripts and/or deps not done
 * - 📝 TODO       → nothing done or legacy setup
 *
 * @param {string} appName - The application folder name.
 * @returns {'✅ Done' | '⚠️ Partial' | '📝 TODO'} - Migration status label.
 */
const getTestMigrationStatus = (appName) => {
  const appPath = path.join(applicationsBasePath, appName);
  const vitestConfigPath = path.join(appPath, 'vitest.config.js');
  const pkgPath = path.join(appPath, 'package.json');

  let configMigrated = false;
  let scriptsMigrated = false;
  let depsCleaned = true;

  // Check vitest.config.js usage of shared config
  if (fs.existsSync(vitestConfigPath)) {
    const configContent = fs.readFileSync(vitestConfigPath, 'utf-8');
    configMigrated =
      configContent.includes('mergeConfig') &&
      configContent.includes('@ovh-ux/manager-tests-setup');

    if (isDryRun) {
      console.log(`📄 ${appName}: vitest.config.js → ${configMigrated ? '✅ uses shared config' : '📝 legacy config'}`);
    }
  }

  if (!configMigrated) return '📝 TODO';

  // Check package.json only if config is migrated
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

    const scripts = pkg.scripts || {};
    scriptsMigrated = Object.values(scripts).some(cmd => cmd.includes('manager-test'));

    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };
    depsCleaned = !EXCLUDED_TESTS_DEPS.some(dep => dep in allDeps);

    if (isDryRun) {
      console.log(`📦 ${appName}: scripts → ${scriptsMigrated ? '✅ manager-test used' : '📝 vitest still used'}`);
      console.log(`📦 ${appName}: dependencies → ${depsCleaned ? '✅ no deprecated deps' : '📝 still has vitest deps'}`);
    }
  }

  if (configMigrated && scriptsMigrated && depsCleaned) return '✅ Done';
  return '⚠️ Partial';
};

/**
 * Generates and prints a Tests migration status table for all applications.
 */
const generateTestsMigrationsStatusReport = () => {
  const apps = getAvailableApps();
  const report = apps.map((app) => ({
    Application: app,
    'Tests Migration': getTestMigrationStatus(app),
  }));

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
};

generateTestsMigrationsStatusReport();
