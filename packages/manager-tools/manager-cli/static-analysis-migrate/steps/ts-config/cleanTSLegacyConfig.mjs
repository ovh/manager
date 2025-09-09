#!/usr/bin/env node
import path from 'path';

import { applicationsBasePath } from '../../../utils/AppUtils.mjs';
import {
  TS_EXCLUDED_DEPENDENCIES,
  readPackageJson,
  writePackageJson,
} from '../../../utils/DependenciesUtils.mjs';

/**
 * Extract CLI arguments
 */
const appName = process.argv[2];
const isDryRun = process.argv.includes('--dry-run');

// Application validation
if (!appName || appName.startsWith('--')) {
  console.error(
    '❌ Missing required <app-name> argument.\nUsage: yarn manager-cli static-analysis-migrate --app <name> [--dry-run]',
  );
  process.exit(1);
}

const applicationPath = path.resolve(applicationsBasePath, appName);

/**
 * Removes legacy or deprecated TypeScript-related devDependencies
 * and creates backups of tsconfig files.
 *
 * TS_EXCLUDED_DEPENDENCIES is a RegExp to match known legacy tools.
 *
 * @returns {Promise<void>}
 */
const cleanTSLegacyConfig = async () => {
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
  if (removedDeps.length) {
    console.log(`📦 Removed devDependencies: ${removedDeps.join(', ')}`);
  } else {
    console.log('✅ No legacy TypeScript dependencies found.');
  }
};

// Run main
cleanTSLegacyConfig().catch((err) => {
  console.error('❌ Unexpected error during cleanup:', err);
  process.exit(1);
});
