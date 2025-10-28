import { spawnSync } from 'node:child_process';

import { logInfo, logWarn } from './log-utils.js';

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
