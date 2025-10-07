import fs from 'node:fs';
import path from 'node:path';

import { appsDir, librariesBasePaths, staticDiscoveredLibraries } from '../cli-path-config.js';
import { readJsonSafe } from './file-utils.js';
import { logWarn } from './log-utils.js';

/**
 * Determine whether a given package directory represents a React-based module.
 *
 * This function inspects the `package.json` file located at `pkgPath`
 * and checks whether any of its dependencies, devDependencies, or peerDependencies
 * include `react`. If the file does not exist, cannot be parsed, or the
 * dependency is missing, it returns `false`.
 *
 * @param {string} pkgPath - Absolute path to a `package.json` file.
 * @returns {boolean} `true` if the module depends on React, otherwise `false`.
 *
 * @example
 * isReactModule('/path/to/package.json');
 * // → true if the package declares React as a dependency
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
 * Discover all valid application or library modules by scanning predefined directories.
 *
 * Depending on the `isLibrary` flag, this function inspects:
 * - Libraries under: `packages/manager/core`, `packages/manager/modules`, and `packages/components`
 * - Applications under: `manager/apps`
 *
 * For each folder containing a `package.json` that represents a React module,
 * a module descriptor object is created with metadata.
 *
 * @param {boolean} [isLibrary=false] - Whether to scan for libraries (`true`) or apps (`false`).
 * @returns {Array<{ fullPath: string, shortPath: string, packageName: string }>}
 * Array of discovered module descriptors.
 *
 * @example
 * // Discover apps
 * discoverModules();
 * // → [{ fullPath: '/.../manager/apps/zimbra', shortPath: 'zimbra', packageName: '@ovh-ux/manager-zimbra-app' }]
 *
 * @example
 * // Discover libraries
 * discoverModules(true);
 * // → [{ fullPath: '/.../packages/manager/core/core-shell', shortPath: 'core-shell', packageName: '@ovh-ux/manager-core-shell' }]
 */
export function discoverModules(isLibrary = false) {
  const discovered = [];
  const modulesPaths = isLibrary ? librariesBasePaths : [appsDir];

  for (const moduleBasePath of modulesPaths) {
    if (!fs.existsSync(moduleBasePath)) continue;

    const items = fs.readdirSync(moduleBasePath, { withFileTypes: true });
    for (const item of items) {
      if (item.isDirectory()) {
        const appFolder = path.join(moduleBasePath, item.name);
        const pkgPath = path.join(appFolder, 'package.json');
        if (fs.existsSync(pkgPath) && isReactModule(pkgPath)) {
          const pkgDetails = readJsonSafe(pkgPath);
          discovered.push({
            fullPath: appFolder,
            shortPath: item.name,
            packageName: pkgDetails.name,
          });
        }
      }
    }
  }

  return isLibrary ? [...discovered, ...staticDiscoveredLibraries] : discovered;
}

/**
 * Retrieve a single module (app or library) matching a given pattern.
 *
 * This function searches through discovered modules (via {@link discoverModules})
 * and returns the first one matching any of the following:
 * - The module's absolute path (`fullPath`)
 * - The folder name (`shortPath`)
 * - The npm package name (`packageName`)
 *
 * @param {string} modulePattern - Pattern to match against module identifiers.
 * @param {boolean} [isLibrary=false] - Whether to search within libraries (`true`) or apps (`false`).
 * @returns {{ fullPath: string, shortPath: string, packageName: string }}
 * The matched module descriptor, or `undefined` if no match is found.
 *
 * @example
 * // Match by folder name
 * getModule('zimbra');
 * // → { fullPath: '/.../manager/apps/zimbra', shortPath: 'zimbra', packageName: '@ovh-ux/manager-zimbra-app' }
 *
 * @example
 * // Match by package name
 * getModule('@ovh-ux/manager-core-shell', true);
 * // → { fullPath: '/.../packages/manager/core/core-shell', shortPath: 'core-shell', packageName: '@ovh-ux/manager-core-shell' }
 */
export function getModule(modulePattern, isLibrary = false) {
  const discoveredLibraries = discoverModules(isLibrary) || [];
  return discoveredLibraries.find(
    (library) =>
      library.fullPath === modulePattern ||
      library.shortPath === modulePattern ||
      library.packageName === modulePattern,
  );
}
