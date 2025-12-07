import fs from 'fs';
import path from 'path';

import { applicationsBasePath } from './AppUtils.mjs';
import { readPackageJson } from './DependenciesUtils.mjs';

/**
 * Name of the static analysis kit package required in migrated apps.
 * @type {string}
 */
export const KIT_PKG = '@ovh-ux/manager-static-analysis-kit';

/**
 * Directories ignored during file system scans.
 * @type {Set<string>}
 */
export const IGNORED_DIRS = new Set([
  'node_modules',
  'public',
  'dist',
  'build',
  '.next',
  'coverage',
]);

/**
 * Supported code file extensions to scan.
 * @type {Set<string>}
 */
export const CODE_EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.mts', '.cts']);

/**
 * Read a file and return its text contents.
 *
 * @param {string} file - Absolute path to the file.
 * @returns {string} The file content as UTF-8 text, or an empty string if reading fails.
 */
const readText = (file) => {
  try {
    return fs.readFileSync(file, 'utf-8');
  } catch {
    return '';
  }
};

/**
 * Check whether a package.json object declares a dependency on the static analysis kit.
 *
 * @param {object} pkg - Parsed package.json content.
 * @returns {boolean} True if the dependency is present, false otherwise.
 */
const hasKitDep = (pkg) => {
  if (!pkg) return false;
  const all = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  return KIT_PKG in all;
};

/**
 * Recursively traverse a directory tree using depth-first search.
 * Skips ignored directories and filters files by extension.
 * Short-circuits if the callback returns true.
 *
 * @param {string} rootDir - Path of the root directory to scan.
 * @param {(file: string) => boolean | void} onFile - Callback applied to each file.
 *        If it returns true, traversal stops immediately.
 * @returns {boolean} True if traversal was short-circuited, false otherwise.
 */
function walkAndDetect(rootDir, onFile) {
  const stack = [rootDir];
  while (stack.length) {
    const dir = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;
      if (IGNORED_DIRS.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
        continue;
      }
      const ext = path.extname(full);
      if (!CODE_EXT.has(ext)) continue;
      if (onFile(full) === true) return true;
    }
  }
  return false;
}

/**
 * Determine the migration status of an application.
 *
 * The scan checks:
 *  - Dependency on `@ovh-ux/manager-static-analysis-kit`
 *  - Presence of a setup import (via regex)
 *  - Presence of a matcher call (via regex)
 *
 * Returns a status string, and when not fully done, it includes
 * a concise hint about what's missing.
 *
 * Examples:
 *  - "✅ Done"
 *  - "⚠️ Partial — missing: setup import"
 *  - "📝 TODO — missing: deps, setup import, matcher"
 *
 * @param {string} appName - Name of the application directory under `applicationsBasePath`.
 * @param {object} options - Options for detection.
 * @param {RegExp} options.setupImportRe - Regex to detect setup imports.
 * @param {RegExp} options.matcherRe - Regex to detect matcher usage.
 * @param {boolean} [options.verbose=false] - Whether to log diagnostic output.
 * @returns {'✅ Done' | string} Status of migration (with hints for Partial/TODO).
 */
export function getMigrationStatusForApp(appName, { setupImportRe, matcherRe, verbose = false }) {
  const appPath = path.join(applicationsBasePath, appName);
  const pkg = readPackageJson(appPath);
  const depsOk = hasKitDep(pkg);

  let hasSetupImport = false;
  let hasMatcher = false;

  walkAndDetect(appPath, (file) => {
    const code = readText(file);
    if (!hasSetupImport && setupImportRe.test(code)) hasSetupImport = true;
    if (!hasMatcher && matcherRe.test(code)) hasMatcher = true;
    return hasSetupImport && hasMatcher;
  });

  if (verbose) {
    console.log(`📦 ${appName}: deps(${KIT_PKG}) → ${depsOk ? '✅' : '📝'}`);
    console.log(`📦 ${appName}: setup import → ${hasSetupImport ? '✅' : '📝'}`);
    console.log(`📦 ${appName}: matcher usage → ${hasMatcher ? '✅' : '📝'}`);
  }

  const missing = [];
  if (!depsOk) missing.push('deps');
  if (!hasSetupImport) missing.push('setup import');
  if (!hasMatcher) missing.push('matcher');

  if (missing.length === 0) return '✅ Done';

  // If something is missing, be explicit in the same cell value.
  const hint = `missing: ${missing.join(', ')}`;
  // Distinguish between no signals at all vs some present
  const hasAny = depsOk || hasSetupImport || hasMatcher;
  return hasAny ? `⚠️ Partial — ${hint}` : `📝 TODO — ${hint}`;
}
