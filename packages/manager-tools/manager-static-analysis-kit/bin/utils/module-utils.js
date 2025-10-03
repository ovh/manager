import fs from 'node:fs';
import path from 'node:path';

import { librariesNames } from '../cli-path-config.js';
import { readJsonSafe } from './file-utils.js';
import { logError, logWarn } from './log-utils.js';

/**
 * Check if a given package.json belongs to React.
 */
export function isReactModule(pkgPath) {
  try {
    if (!fs.existsSync(pkgPath)) return false;

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    if (!pkg || typeof pkg !== 'object') return false;

    const deps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
    return Boolean(deps.react);
  } catch (err) {
    logWarn(`Failed to read or parse ${pkgPath}: ${err.message}`);
    return false;
  }
}

/**
 * Resolve module short name from package.json (fallback to folder).
 */
export function getModuleShortName(pkgPath, folder) {
  const pkg = readJsonSafe(pkgPath) || {};
  return (pkg.name && String(pkg.name).replace(/^@ovh-ux\//, '')) || folder;
}

/**
 * Extract an app folder name from an OVH Manager package name.
 *
 * Example:
 *   "@ovh-ux/manager-zimbra-app" → "zimbra"
 *
 * @param {string} packageName - Full npm package name.
 * @returns {string|null} The extracted app folder name, or null if the format is invalid.
 */
export function extractAppFolderFromPackageName(packageName) {
  const match = packageName.match(/^@ovh-ux\/manager-(.+)-app$/);
  return match ? match[1] : null;
}

/**
 * Check whether a given folder name exists inside one of the configured
 * library directories (`librariesNames`).
 *
 * @param {string} folder - Folder name to look for.
 * @returns {boolean} True if the folder exists in any library directory.
 *
 * @example
 * isExistInLibs("core-shell"); // → true if ./packages/manager/core/core-shell exists
 */
export function isExistInLibs(folder) {
  return librariesNames.some((libDir) => folder === libDir);
}

/**
 * Extract a library folder name from a Manager package name.
 *
 * Matches package names like:
 *   "@ovh-ux/manager-core-shell" → "core-shell"
 *   "@ovh-ux/manager-react-components" → "react-components"
 *
 * @param {string} packageName - Full npm package name.
 * @returns {string|null} Extracted folder name or null if format is invalid.
 *
 * @example
 * extractLibraryFolderFromPackageName("@ovh-ux/manager-core-shell");
 * // → "core-shell"
 */
export function extractLibraryFolderFromPackageName(packageName) {
  const match = packageName.match(/^@ovh-ux\/(.+)$/);
  return match ? match[1] : null;
}

/**
 * Unified module info resolver.
 * - Ensures folder exists
 * - Ensures package.json exists
 * - Optionally enforces React
 */
export function resolveModuleInfo(analysisDir, moduleFolder, { requireReact = false } = {}) {
  const moduleDir = path.join(analysisDir, moduleFolder);
  if (!fs.existsSync(moduleDir)) {
    logError(`❌ Module folder not found: ${moduleFolder} → skipping`);
    return null;
  }

  const pkgPath = path.join(moduleDir, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    logWarn(`⚠️ No package.json for ${moduleFolder}, skipping`);
    return null;
  }

  if (requireReact && !isReactModule(pkgPath)) {
    logWarn(`⚠️ ${moduleFolder} is not a React module, skipping`);
    return null;
  }

  return {
    pkgPath,
    moduleDir,
    moduleFolder,
    moduleShortName: getModuleShortName(pkgPath, moduleFolder),
    pkg: readJsonSafe(pkgPath),
  };
}
