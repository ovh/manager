#!/usr/bin/env node

import path from 'path';
import fs from 'fs/promises';
import {
  readPackageJson,
  TS_EXCLUDED_DEPENDENCIES,
  writePackageJson,
} from '../../../utils/DependenciesUtils.mjs';
import { applicationsBasePath } from '../../../utils/AppUtils.mjs';

/**
 * Extract CLI arguments
 */
const appName = process.argv[2];
const isDryRun = process.argv.includes('--dry-run');

// Application validation
if (!appName || appName.startsWith('--')) {
  console.error('❌ Missing required <app-name> argument.\nUsage: yarn manager-cli static-analysis-migrate --app <name> [--dry-run]');
  process.exit(1);
}

const applicationPath = path.resolve(applicationsBasePath, appName);

async function cleanTSLegacyConfig() {
  const removedDeps = [];

  const pkg = readPackageJson(applicationPath);
  if (!pkg) {
    console.error(`❌ Could not read package.json at ${applicationPath}`);
    process.exit(1);
  }

  const devDeps = pkg.devDependencies || {};
  for (const dep of Object.keys(devDeps)) {
    if (TS_EXCLUDED_DEPENDENCIES.test(dep)) {
      removedDeps.push(dep);
      delete devDeps[dep];
    }
  }
  pkg.devDependencies = devDeps;

  if (!isDryRun) {
    writePackageJson(applicationPath, pkg);
  }

  console.log(`\n✅ TypeScript legacy cleanup complete for "${appName}"`);
  if (removedDeps.length) console.log(`📦 Removed devDependencies: ${removedDeps.join(', ')}`);
  else console.log('✅ No legacy TypeScript dependencies found.');
}

cleanTSLegacyConfig().catch((err) => {
  console.error('❌ Unexpected error during cleanup:', err);
  process.exit(1);
});
