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
function buildAppsFilters(appsDir, appFolders) {
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
 * @param {string} options.analysisDir - Absolute path to the apps root directory.
 * @param {string[]} options.appFolders - List of app folders to analyze.
 * @param {string[]} options.packageNames - List of package names (overrides appFolders).
 * @returns {string[]} List of resolved Turbo filters (package names).
 *
 * @example
 * buildTurboFilters({
 *   analysisDir: "/workspace/manager/apps",
 *   appFolders: ["zimbra"],
 *   packageNames: []
 * });
 * // → ["@ovh-ux/manager-zimbra-app"]
 *
 * @example
 * buildTurboFilters({
 *   analysisDir: "/workspace/manager/apps",
 *   appFolders: [],
 *   packageNames: ["@ovh-ux/manager-web-app"]
 * });
 * // → ["@ovh-ux/manager-web-app"]
 */
export function buildTurboFilters({ analysisDir, appFolders, packageNames }) {
  let filters = [];

  if (appFolders.length > 0 && packageNames.length === 0) {
    filters = buildAppsFilters(analysisDir, appFolders);
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
 * @param {string[]} [extraArgs=[]] - Additional arguments to forward to Turbo.
 * @returns {void}
 *
 * @example
 * runTurboBuild("/workspace", ["@ovh-ux/manager-zimbra-app"]);
 * // Executes: turbo run build --filter @ovh-ux/manager-zimbra-app
 */
export function runTurboBuild(rootDir, filters, extraArgs = []) {
  if (filters.length === 0) {
    logWarn('⚠️ No Turbo build filters provided, skipping build step.');
    return;
  }

  const turboArgs = [
    'run',
    'build',
    ...filters.flatMap((pkgName) => ['--filter', pkgName]),
    ...extraArgs,
  ];
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

/**
 * Run Turbo tests with optional filters and extra arguments.
 *
 * This function spawns a synchronous Turbo process to run tests,
 * applying filters for specific packages if provided. It logs
 * progress and warns if any tests fail, but does not throw.
 *
 * @param {string} rootDir - Root directory to run Turbo in (typically the monorepo root).
 * @param {string[]} filters - List of package filters (Turbo `--filter` flags).
 * @param {string[]} [extraArgs=[]] - Additional arguments to forward to Turbo.
 * @returns {void}
 *
 * @example
 * // Run tests for "web" and "zimbra" apps with coverage
 * runTurboTests(process.cwd(), ['web', 'zimbra'], ['--', '--coverage']);
 */
export function runTurboTests(rootDir, filters, extraArgs = []) {
  const args = [
    'run',
    'test',
    ...filters.flatMap((pkgName) => ['--filter', pkgName]),
    ...extraArgs,
  ];
  logInfo(`Testing with Turbo (filters: ${filters.join(', ')})`);

  const res = spawnSync('turbo', args, {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true,
  });

  if (res.status !== 0) {
    logWarn('⚠️ Turbo tests failed for one or more targets. Will still harvest coverage if any.');
  }
}
