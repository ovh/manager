#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { applicationsBasePath, getAvailableApps } from '../../utils/AppUtils.mjs';
import { babelConfigurationFiles, REQUIRED_DEP_VERSIONS, satisfiesVersion } from '../../utils/DependenciesUtils.mjs';
import { getTestMigrationStatus } from '../../utils/TestUtils.mjs';
import { renderReport, reportOutputBasePath } from '../../utils/ExportUtils.mjs';

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');

const formatArgIndex = args.findIndex(arg => arg === '--format');
const format = formatArgIndex !== -1 ? args[formatArgIndex + 1] : null;

const outputFile = format === 'json'
  ? `${reportOutputBasePath}/swc-migration-report.json`
  : format === 'html'
    ? `${reportOutputBasePath}/swc-migration-report.html`
    : null;

/**
 * Check whether an app is migrated to SWC.
 * Skips check if tests migration is not complete.
 *
 * @param {string} appName
 * @returns {'✅ Done' | '📝 TODO'}
 */
const getSwcMigrationStatus = (appName) => {
  const testStatus = getTestMigrationStatus(appName, { verbose: isDryRun });
  if (testStatus !== '✅ Done') {
    if (isDryRun) {
      console.log(`⏭️ ${appName}: Skipping SWC check (tests not fully migrated)`);
    }
    return '📝 TODO';
  }

  const appPath = path.join(applicationsBasePath, appName);
  const pkgPath = path.join(appPath, 'package.json');

  let babelFilesCleaned = true;
  let babelDepsRemoved = true;
  let depsOk = true;
  const depsErrors = [];

  for (const file of babelConfigurationFiles) {
    if (fs.existsSync(path.join(appPath, file))) {
      babelFilesCleaned = false;
      if (isDryRun) console.log(`🛑 ${appName}: Babel config found → ${file}`);
    }
  }

  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

    Object.keys(allDeps).forEach((dep) => {
      if (dep.startsWith('@babel/') || dep === 'babel-loader') {
        babelDepsRemoved = false;
        if (isDryRun) console.log(`🛑 ${appName}: Babel dep found → ${dep}`);
      }
    });

    const managerVite = allDeps['@ovh-ux/manager-vite-config'];
    if (!managerVite || !satisfiesVersion(REQUIRED_DEP_VERSIONS['@ovh-ux/manager-vite-config'], managerVite)) {
      depsOk = false;
      depsErrors.push(`🟥 @ovh-ux/manager-vite-config required: ${REQUIRED_DEP_VERSIONS['@ovh-ux/manager-vite-config']}, found: ${managerVite || 'not installed'}`);
    } else if (isDryRun) {
      console.log(`   - @ovh-ux/manager-vite-config version: ✅ ${managerVite}`);
    }

    const vite = allDeps['vite'];
    if (vite) {
      if (!satisfiesVersion(REQUIRED_DEP_VERSIONS['vite'], vite)) {
        depsOk = false;
        depsErrors.push(`🟥 vite required: ${REQUIRED_DEP_VERSIONS['vite']}, found: ${vite}`);
      } else if (isDryRun) {
        console.log(`   - vite version: ✅ ${vite}`);
      }
    } else if (isDryRun) {
      console.log(`   - vite version: ⚪️ not installed (optional)`);
    }
  }

  const isMigrated = babelFilesCleaned && babelDepsRemoved && depsOk;

  if (isDryRun) {
    if (!babelFilesCleaned) console.log(`❌ ${appName}: Babel config files not removed`);
    if (!babelDepsRemoved) console.log(`❌ ${appName}: Babel dependencies not cleaned`);
    if (!depsOk) depsErrors.forEach(e => console.log(e));
    if (isMigrated) console.log(`✅ ${appName}: SWC migration complete`);
  }

  return isMigrated ? '✅ Done' : '📝 TODO';
};

/**
 * Run and render SWC migration report.
 */
const generateSwcMigrationsStatusReport = () => {
  const apps = getAvailableApps();
  const report = apps.map((app) => ({
    Application: app,
    'SWC Migration': getSwcMigrationStatus(app),
  }));

  renderReport(report, {
    title: 'SWC Migration',
    statusKeys: ['SWC Migration'],
    format,
    filename: outputFile,
  });
};

generateSwcMigrationsStatusReport();
