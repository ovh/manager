import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import { logError, logInfo, logWarn } from './log-utils.js';

/**
 * Convert app folder names into Turbo filters by resolving their package.json names.
 *
 * Each app folder must contain a valid `package.json`. If not found, the app is skipped.
 *
 * @param {string} appsDir - Absolute path to the apps root directory.
 * @param {string[]} appFolders - List of app folder names inside the apps directory.
 * @returns {string[]} Array of package names to be used as Turbo filters.
 *
 * @example
 * // appsDir = "/workspace/manager/apps"
 * // appFolders = ["zimbra", "web"]
 * // Returns: ["@ovh-ux/manager-zimbra-app", "@ovh-ux/manager-web-app"]
 */
function resolveTurboFiltersFromAppFolders(appsDir, appFolders) {
  return appFolders
    .map((appFolder) => {
      const pkgPath = path.join(appsDir, appFolder, 'package.json');
      if (!fs.existsSync(pkgPath)) {
        logError(`❌ No package.json for app folder ${appFolder}, skipping`);
        return null;
      }
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      return pkg.name;
    })
    .filter(Boolean);
}

/**
 * Resolve Turbo filters (package names) based on input mode.
 *
 * - If only `appFolders` are provided, resolves their corresponding package names.
 * - If `packageNames` are provided, they are used directly as filters.
 *
 * @param {Object} options
 * @param {string} options.appsDir - Absolute path to the apps root directory.
 * @param {string[]} options.appFolders - List of app folders to analyze.
 * @param {string[]} options.packageNames - List of package names (overrides appFolders).
 * @returns {string[]} List of resolved Turbo filters (package names).
 *
 * @example
 * resolveTurboFilters({
 *   appsDir: "/workspace/manager/apps",
 *   appFolders: ["zimbra"],
 *   packageNames: []
 * });
 * // → ["@ovh-ux/manager-zimbra-app"]
 *
 * @example
 * resolveTurboFilters({
 *   appsDir: "/workspace/manager/apps",
 *   appFolders: [],
 *   packageNames: ["@ovh-ux/manager-web-app"]
 * });
 * // → ["@ovh-ux/manager-web-app"]
 */
export function resolveTurboFilters({ appsDir, appFolders, packageNames }) {
  let filters = [];

  if (appFolders.length > 0 && packageNames.length === 0) {
    filters = resolveTurboFiltersFromAppFolders(appsDir, appFolders);
  } else if (packageNames.length > 0) {
    filters = packageNames;
  }

  return filters;
}

/**
 * Run a Turbo build for the provided filters.
 *
 * - Executes `turbo run build` with `--filter` for each package name.
 * - Runs in the specified root directory.
 * - If no filters are provided, the build step is skipped with a warning.
 *
 * @param {string} rootDir - Root directory where Turbo should be executed.
 * @param {string[]} filters - List of Turbo build filters (package names).
 * @returns {void}
 *
 * @example
 * runTurboBuild("/workspace", ["@ovh-ux/manager-zimbra-app"]);
 * // Executes: turbo run build --filter @ovh-ux/manager-zimbra-app
 */
export function runTurboBuild(rootDir, filters) {
  if (filters.length === 0) {
    logWarn('⚠️ No Turbo build filters provided, skipping build step.');
    return;
  }

  const turboArgs = ['run', 'build', ...filters.flatMap((pkgName) => ['--filter', pkgName])];
  logInfo(`Building with Turbo (filters: ${filters.join(', ')})`);

  const buildResult = spawnSync('turbo', turboArgs, {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true,
  });

  if (buildResult.status !== 0) {
    logWarn('⚠️ Turbo build failed for one or more targets. Will still try to analyze apps.');
  }
}
