#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { applicationsBasePath, getAvailableApps } from '../../utils/AppUtils.mjs';
import { getTestMigrationStatus } from './generate-tests-migrations-status-report.mjs';
import { babelConfigurationFiles, REQUIRED_DEP_VERSIONS, satisfiesVersion } from '../../utils/DependenciesUtils.mjs';

const isDryRun = process.argv.includes('--dry-run');

/**
 * Check whether an app is migrated to SWC.
 * Skips check if tests migration is not complete.
 *
 * @param {string} appName
 * @returns {'✅ Done' | '📝 TODO' | '⏭️ Skipped'}
 */
const getSwcMigrationStatus = (appName) => {
  const testStatus = getTestMigrationStatus(appName);
  if (testStatus !== '✅ Done') {
    if (isDryRun) {
      console.log(`⏭️ ${appName}: Skipping SWC check (tests not fully migrated)`);
    }
    return '⏭️ Skipped';
  }

  const appPath = path.join(applicationsBasePath, appName);
  const pkgPath = path.join(appPath, 'package.json');

  let babelFilesCleaned = true;
  let babelDepsRemoved = true;
  let depsOk = true;
  const depsErrors = [];

  // Step 1: Detect babel config files
  for (const file of babelConfigurationFiles) {
    if (fs.existsSync(path.join(appPath, file))) {
      babelFilesCleaned = false;
      if (isDryRun) console.log(`🛑 ${appName}: Babel config found → ${file}`);
    }
  }

  // Step 2: Check package.json
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };

    // Detect any @babel/* or babel-loader
    Object.keys(allDeps).forEach((dep) => {
      if (dep.startsWith('@babel/') || dep === 'babel-loader') {
        babelDepsRemoved = false;
        if (isDryRun) console.log(`🛑 ${appName}: Babel dep found → ${dep}`);
      }
    });

    // Check required versions
    const managerViteConfigVersion = allDeps['@ovh-ux/manager-vite-config'];
    const requiredManagerVite = REQUIRED_DEP_VERSIONS['@ovh-ux/manager-vite-config'];
    if (!managerViteConfigVersion || !satisfiesVersion(requiredManagerVite, managerViteConfigVersion)) {
      depsOk = false;
      depsErrors.push(`🟥 @ovh-ux/manager-vite-config required: ${requiredManagerVite}, found: ${managerViteConfigVersion || 'not installed'}`);
    } else if (isDryRun) {
      console.log(`   - @ovh-ux/manager-vite-config version: ✅ ${managerViteConfigVersion}`);
    }

    const viteVersion = allDeps['vite'];
    const requiredVite = REQUIRED_DEP_VERSIONS['vite'];
    if (viteVersion) {
      if (!satisfiesVersion(requiredVite, viteVersion)) {
        depsOk = false;
        depsErrors.push(`🟥 vite required: ${requiredVite}, found: ${viteVersion}`);
      } else if (isDryRun) {
        console.log(`   - vite version: ✅ ${viteVersion}`);
      }
    } else if (isDryRun) {
      console.log(`   - vite version: ⚪️ not installed (optional)`);
    }
  }

  const isMigrated = babelFilesCleaned && babelDepsRemoved && depsOk;

  if (isDryRun) {
    if (!babelFilesCleaned) console.log(`❌ ${appName}: Babel config files not removed`);
    if (!babelDepsRemoved) console.log(`❌ ${appName}: Babel dependencies not cleaned`);
    if (!depsOk) depsErrors.forEach((e) => console.log(e));
    if (isMigrated) console.log(`✅ ${appName}: SWC migration complete`);
  }

  return isMigrated ? '✅ Done' : '📝 TODO';
};


/**
 * Report SWC migration status for all apps.
 */
const generateSwcMigrationsStatusReport = () => {
  const apps = getAvailableApps();
  const report = apps.map((app) => ({
    Application: app,
    'SWC Migration': getSwcMigrationStatus(app),
  }));

  console.log('\n📦 SWC Migration Matrix:\n');
  console.table(report);

  const summary = report.reduce((acc, { 'SWC Migration': status }) => {
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

generateSwcMigrationsStatusReport();
