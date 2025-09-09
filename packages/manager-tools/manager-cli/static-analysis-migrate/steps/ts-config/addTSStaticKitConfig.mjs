#!/usr/bin/env node
import { readFileSync } from 'fs';
import { copyFile, unlink, writeFile } from 'fs/promises';
import path from 'path';

import reactTSBaseConfig from '../../../../../manager-tools/manager-static-analysis-kit/dist/tsconfig/react.json' with { type: 'json' };
import { applicationsBasePath } from '../../../utils/AppUtils.mjs';
import { readPackageJson, writePackageJson } from '../../../utils/DependenciesUtils.mjs';

const appName = process.argv[2];
const isDryRun = process.argv.includes('--dry-run');

if (!appName || appName.startsWith('--')) {
  console.error('❌ Missing required <app-name> argument.');
  process.exit(1);
}

const appPath = path.resolve(applicationsBasePath, appName);
const tsconfigPath = path.join(appPath, 'tsconfig.json');
const tsconfigStrictPath = path.join(appPath, 'tsconfig.strict.json');

const basePriorAttributes = new Set([
  'strict',
  'jsx',
  'lib',
  'module',
  'target',
  'moduleResolution',
]);

/**
 *
 * Read a JSON file if it exists, returns empty object otherwise.
 * @param {string} filepath
 * @returns {any|null}
 */
const readJSONFileIfExists = (filepath) => {
  try {
    const raw = readFileSync(filepath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to read/parse JSON: ${filepath}`, err.message);
    return null;
  }
};

/**
 * Backups a file to `<filename>.backup` if it exists.
 * @param {string} appPath - Absolute path to the app.
 * @returns {Promise<void>}
 */
const backupTSConfigFiles = async (appPath) => {
  const backup = async (filename) => {
    const filePath = path.join(appPath, filename);
    const backupPath = path.join(appPath, `${filename}.backup`);
    try {
      await copyFile(filePath, backupPath);
      console.log(`🧪 Backed up ${filename} → ${filename}.backup`);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
  };
  await Promise.all(['tsconfig.json', 'tsconfig.strict.json'].map(backup));
};

/**
 * Removes backup files if they exist.
 * @param {string} appPath - Absolute path to the app.
 * @returns {Promise<void>}
 */
const removeTSConfigBackups = async (appPath) => {
  const remove = async (filename) => {
    const backupPath = path.join(appPath, `${filename}.backup`);
    try {
      await unlink(backupPath);
      console.log(`🧹 Removed ${filename}.backup`);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
  };
  await Promise.all(['tsconfig.json', 'tsconfig.strict.json'].map(remove));
};

/**
 * Returns a deep cloned version of the given object.
 * @template T
 * @param {T} obj - Object to clone.
 * @returns {T}
 */
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

/**
 * Computes the delta between app config and base config,
 * excluding overridden attributes and preserving custom ones.
 *
 * @param {object} base - Base tsconfig (from static-kit).
 * @param {object} app - App’s existing tsconfig.
 * @returns {object} - Delta config.
 */
const computeDelta = (base, app) => {
  const delta = { compilerOptions: {} };
  const baseCompiler = base.compilerOptions || {};
  const appCompiler = app.compilerOptions || {};

  for (const key in appCompiler) {
    if (basePriorAttributes.has(key)) continue;
    if (JSON.stringify(appCompiler[key]) !== JSON.stringify(baseCompiler[key])) {
      delta.compilerOptions[key] = appCompiler[key];
    }
  }

  for (const key of ['paths', 'baseUrl']) {
    if (appCompiler[key]) {
      delta.compilerOptions[key] = appCompiler[key];
    }
  }

  if (app.include) delta.include = app.include;
  if (app.exclude) delta.exclude = app.exclude;

  return delta;
};

/**
 * Logs a JSON object with a label.
 * @param {string} label - Section label.
 * @param {object} data - Object to log.
 */
const logBlock = (label, data) => {
  console.log(`\n📄 ${label}:\n${JSON.stringify(data, null, 2)}`);
};

/**
 * Logs differences between two config objects.
 * @param {string} label - Section label.
 * @param {object} a - Original object.
 * @param {object} b - New object.
 */
const logDiff = (label, a, b) => {
  const diff = {};
  const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const key of allKeys) {
    const av = JSON.stringify(a[key]);
    const bv = JSON.stringify(b[key]);
    if (av !== bv) {
      diff[key] = { before: a[key], after: b[key] };
    }
  }
  console.log(`\n🧩 Diff: ${label}\n${JSON.stringify(diff, null, 2)}`);
};

/**
 * Main function: migrates tsconfig and package.json to use static-kit.
 * Applies both loose and strict configs with appropriate extension.
 */
const addTSStaticKitConfig = async () => {
  const pkg = readPackageJson(appPath);
  if (!pkg) {
    console.error(`❌ Could not read package.json at ${appPath}`);
    process.exit(1);
  }

  if (!isDryRun) {
    await backupTSConfigFiles(appPath);
  }

  const staticKitBase = reactTSBaseConfig;
  const appLoose = readJSONFileIfExists(tsconfigPath);
  const looseDelta = computeDelta(staticKitBase, appLoose);
  const strictDelta = deepClone(looseDelta);

  const looseFinal = {
    extends: '@ovh-ux/manager-static-analysis-kit/tsconfig/react',
    ...looseDelta,
  };

  const strictFinal = {
    extends: '@ovh-ux/manager-static-analysis-kit/tsconfig/react-strict',
    ...strictDelta,
  };

  if (isDryRun) {
    logBlock('Original tsconfig.json', appLoose);
    logBlock('Static-kit merged base', staticKitBase);
    logBlock('Computed delta', looseDelta);
    logBlock('Final tsconfig.json', looseFinal);
    logBlock('Final tsconfig.strict.json', strictFinal);
    logDiff('tsconfig.json diff', appLoose, looseFinal);
    console.log('\n🧪 [dry-run] No changes written.');
    return;
  }

  pkg.devDependencies ||= {};
  pkg.devDependencies['@ovh-ux/manager-static-analysis-kit'] = '*';
  pkg.scripts ||= {};
  if (!pkg.scripts['build:strict']) {
    pkg.scripts['build:strict'] = 'tsc --project tsconfig.strict.json && vite build';
  }

  writePackageJson(appPath, pkg);

  try {
    await writeFile(tsconfigPath, JSON.stringify(looseFinal, null, 2));
    await writeFile(tsconfigStrictPath, JSON.stringify(strictFinal, null, 2));
    await removeTSConfigBackups(appPath);
  } catch (err) {
    console.error('❌ Failed to write tsconfig files:', err);
    process.exit(1);
  }

  console.log(`\n✅ Static-kit config applied to "${appName}"`);
};

addTSStaticKitConfig().catch((err) => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
