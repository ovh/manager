#!/usr/bin/env node
import { rm } from 'fs/promises';
import path from 'path';

import { applicationsBasePath } from '../../../utils/AppUtils.mjs';
import { isCodeFileExistsSync } from '../../../utils/CodeTransformUtils.mjs';
import {
  ESLINT_DEP_REGEX,
  EXCLUDED_ESLINT_FILES,
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
 * Cleans up legacy ESLint configuration from the target app
 * - Removes legacy config files (.eslintrc*, eslint.config.js, etc.)
 * - Removes ESLint-related devDependencies
 * - Removes lint-related npm scripts
 *
 * @returns {Promise<void>}
 */
const cleanEslintLegacyConfig = async () => {
  const removedFiles = [];
  const removedDeps = [];
  const removedScripts = [];

  // 1. Remove legacy ESLint config files
  for (const file of EXCLUDED_ESLINT_FILES) {
    const filePath = path.join(applicationPath, file);
    if (isCodeFileExistsSync(filePath)) {
      if (isDryRun) {
        console.log(`🧪 [dry-run] Would remove: ${file}`);
      } else {
        await rm(filePath);
        console.log(`🧹 Removed: ${file}`);
      }
      removedFiles.push(file);
    }
  }

  // 2. Read and update package.json
  const pkg = readPackageJson(applicationPath);
  if (!pkg) {
    console.error(`❌ Could not read package.json at ${applicationPath}`);
    process.exit(1);
  }

  const devDeps = pkg.devDependencies || {};
  for (const depName of Object.keys(devDeps)) {
    if (ESLINT_DEP_REGEX.test(depName)) {
      removedDeps.push(depName);
      delete devDeps[depName];
    }
  }

  const scripts = pkg.scripts || {};
  for (const [scriptName, scriptCmd] of Object.entries(scripts)) {
    if (scriptName === 'lint' || scriptName === 'lint:fix' || scriptCmd.includes('eslint')) {
      removedScripts.push(scriptName);
      delete scripts[scriptName];
    }
  }

  if (!isDryRun) {
    writePackageJson(applicationPath, pkg);
  }

  // 3. Print summary report
  console.log(`\n✅ ESLint legacy cleanup complete for "${appName}"`);
  if (removedFiles.length) console.log(`🧹 Removed files: ${removedFiles.join(', ')}`);
  if (removedDeps.length) console.log(`📦 Removed devDependencies: ${removedDeps.join(', ')}`);
  if (removedScripts.length) console.log(`📝 Removed scripts: ${removedScripts.join(', ')}`);
};

// Run
cleanEslintLegacyConfig().catch((err) => {
  console.error('❌ Unexpected error during cleanup:', err);
  process.exit(1);
});
