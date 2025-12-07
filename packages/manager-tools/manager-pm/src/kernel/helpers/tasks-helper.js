import { managerRootPath } from '../../playbook/playbook-config.js';
import {
  resolveApplicationBuildFilter,
  resolveModuleBuildFilter,
  runCommand,
  runTaskFromRoot,
} from '../utils/tasks-utils.js';
import { clearRootWorkspaces, updateRootWorkspacesFromCatalogs } from '../utils/workspace-utils.js';

/**
 * Execute a task within a safe workspace context.
 *
 * Ensures root catalogs are merged before the task runs and cleared afterward,
 * even if the task fails or throws.
 *
 * @template T
 * @param {() => Promise<T>} fn - The async task function to execute.
 * @returns {Promise<T>} The result of the provided task.
 * @example
 * await withWorkspaces(async () => runTaskFromRoot('build', 'turbo', ['run', 'build']));
 */
async function withWorkspaces(fn) {
  await updateRootWorkspacesFromCatalogs();
  try {
    return await fn();
  } finally {
    await clearRootWorkspaces();
  }
}

/**
 * Run a Turbo task (`build` or `test`) in CI mode with optional CLI arguments.
 *
 * Automatically prepares and cleans up workspaces around execution.
 *
 * @async
 * @param {"build"|"test"} task - The Turbo task name.
 * @param {string[]} [options=[]] - Extra CLI args passed to `turbo run <task>`.
 * @returns {Promise<void>} Resolves when the Turbo task completes.
 * @example
 * await runCITask('build', ['--filter=@scope/app']);
 */
export async function runCITask(task, options = []) {
  return withWorkspaces(async () => {
    const args = ['run', task, ...options];
    await runTaskFromRoot(`${task} (CI)`, 'turbo', args);
  });
}

/**
 * Build all targets in CI mode.
 *
 * @async
 * @param {string[]} [options=[]] - Turbo CLI options.
 * @returns {Promise<void>}
 * @example
 * await buildCI(['--filter=@ovh-ux/manager-web']);
 */
export async function buildCI(options = []) {
  return runCITask('build', options);
}

/**
 * Run Turbo tests in CI mode.
 *
 * @async
 * @param {string[]} [options=[]] - Turbo CLI options.
 * @returns {Promise<void>}
 * @example
 * await testCI(['--filter=tag:unit']);
 */
export async function testCI(options = []) {
  return runCITask('test', options);
}

/**
 * Run a Turbo task (e.g., `build` or `test`) for a **specific module only**.
 *
 * This function enforces that a valid module reference is provided — it can
 * no longer be used for global module runs (use `runAllTask()` instead).
 *
 * Example:
 * ```bash
 * yarn manager-pm --action build --module @ovh-ux/manager-core-api
 * yarn manager-pm --action test --module packages/manager/core/api
 * ```
 *
 * @async
 * @param {"build"|"test"|"lint"|string} task - The Turbo task to run for the module.
 * @param {string} targetReference - Module reference or package name.
 * @param {number} [concurrency=1] - Maximum concurrency level for Turbo pipelines.
 * @throws {Error} If no module reference is provided or resolution fails.
 * @returns {Promise<void>} Resolves when the Turbo task completes successfully.
 */
async function runModuleTask(task, targetReference, concurrency = 1) {
  if (!targetReference) {
    throw new Error(
      `runModuleTask: missing target reference. This function requires an explicit module reference.`,
    );
  }

  return withWorkspaces(async () => {
    const args = ['run', task, `--concurrency=${concurrency}`, '--continue=always'];
    const filter = resolveModuleBuildFilter(targetReference);

    if (!filter) {
      throw new Error(`Unable to resolve build filter for module "${targetReference}"`);
    }

    args.push('--filter', filter);

    await runTaskFromRoot(`${task} (${targetReference})`, 'turbo', args);
  });
}

/**
 * Build a single module.
 *
 * @param {string} moduleRef - Module reference or package name.
 * @returns {Promise<void>}
 * @example
 * await buildModule('@ovh-ux/manager-core-api');
 */
export async function buildModule(moduleRef) {
  return runModuleTask('build', moduleRef, 1);
}

/**
 * Test a single module.
 *
 * @param {string} moduleRef - Module reference or package name.
 * @returns {Promise<void>}
 * @example
 * await testModule('packages/manager/core/api');
 */
export async function testModule(moduleRef) {
  return runModuleTask('test', moduleRef, 1);
}

/**
 * Lint a single module using the hybrid lint runner.
 *
 * @param {string} moduleRef - Module reference or package name.
 * @param {string[]} [options=[]] - Additional CLI flags (e.g., `--fix`).
 * @throws {Error} If no module reference or package name cannot be resolved.
 * @returns {Promise<void>}
 * @example
 * await lintModule('@ovh-ux/manager-core-api', ['--fix']);
 */
export async function lintModule(moduleRef, options = []) {
  if (!moduleRef) throw new Error('lintModule: moduleRef is required');

  return withWorkspaces(async () => {
    const pkgName = resolveModuleBuildFilter(moduleRef);

    if (!pkgName) throw new Error(`Unable to resolve package name for "${moduleRef}"`);

    await runTaskFromRoot(`lint (${moduleRef})`, 'yarn', [
      'pm:lint:base',
      '--module',
      pkgName,
      ...options,
    ]);
  });
}

/**
 * Run a Turbo task (e.g., `build` or `test`) for a **specific application only**.
 *
 * This function no longer supports global builds — use `runAllTask()` instead.
 * It validates the `targetReference` and fails fast if not provided.
 *
 * Example:
 * ```bash
 * yarn manager-pm --action build --app web
 * yarn manager-pm --action test --app @ovh-ux/manager-web
 * ```
 *
 * @async
 * @param {"build"|"test"|"lint"|string} task - The Turbo task to run.
 * @param {string} targetReference - Application reference or package name.
 * @param {number} [concurrency=1] - Turbo concurrency level.
 * @throws {Error} If no target reference is provided or resolution fails.
 * @returns {Promise<void>} Resolves when the Turbo task completes successfully.
 */
async function runApplicationTask(task, targetReference, concurrency = 1) {
  if (!targetReference) {
    throw new Error(
      `runApplicationTask: missing target reference. This function requires an explicit app reference.`,
    );
  }

  return withWorkspaces(async () => {
    const args = ['run', task, `--concurrency=${concurrency}`, '--continue=always'];
    const filter = resolveApplicationBuildFilter(targetReference);

    if (!filter) {
      throw new Error(`Unable to resolve build filter for application "${targetReference}"`);
    }

    args.push('--filter', filter);

    await runTaskFromRoot(`${task} (${targetReference})`, 'turbo', args);
  });
}

/**
 * Build a single application.
 *
 * @param {string} appRef - Application reference or package name.
 * @returns {Promise<void>}
 * @example
 * await buildApplication('web');
 */
export async function buildApplication(appRef) {
  return runApplicationTask('build', appRef, 1);
}

/**
 * Run tests for a single application.
 *
 * @param {string} appRef - Application reference or package name.
 * @returns {Promise<void>}
 * @example
 * await testApplication('@ovh-ux/manager-web');
 */
export async function testApplication(appRef) {
  return runApplicationTask('test', appRef, 1);
}

/**
 * Lint a single application using the hybrid lint runner.
 *
 * @param {string} appRef - Application reference or package name.
 * @param {string[]} [options=[]] - Extra CLI args (e.g., `--fix`).
 * @throws {Error} If the app reference is invalid or unresolved.
 * @returns {Promise<void>}
 * @example
 * await lintApplication('web', ['--fix']);
 */
export async function lintApplication(appRef, options = []) {
  if (!appRef) throw new Error('lintApplication: appRef is required');

  return withWorkspaces(async () => {
    const pkgName = resolveApplicationBuildFilter(appRef);
    if (!pkgName) throw new Error(`Unable to resolve package name for "${appRef}"`);

    await runTaskFromRoot(`lint (${appRef})`, 'yarn', [
      'pm:lint:base',
      '--app',
      pkgName,
      ...options,
    ]);
  });
}

/**
 * Run a Turbo task (e.g., `build`, `test`, `lint`) across **all applications and modules**.
 *
 * Automatically prepares and cleans up workspaces before and after execution.
 * This runs the Turbo task globally without any `--filter`, targeting every
 * project in the monorepo.
 *
 * Example:
 * ```bash
 * yarn manager-pm --action full-build
 * yarn manager-pm --action full-test
 * ```
 *
 * @async
 * @param {"build"|"test"|"lint"|string} task - The Turbo task name to execute across all workspaces.
 * @param {number} [concurrency=1] - The maximum number of concurrent Turbo pipelines.
 * @returns {Promise<void>} Resolves when the task completes successfully.
 * @throws {Error} If the underlying Turbo command fails.
 */
async function runAllTask(task, concurrency = 1) {
  return withWorkspaces(async () => {
    const args = ['run', task, `--concurrency=${concurrency}`, '--continue=always'];
    await runTaskFromRoot(`${task} (all: apps + modules)`, 'turbo', args);
  });
}

/**
 * Build all (apps + modules).
 *
 * @returns {Promise<void>}
 * @example
 * await buildAll();
 */
export async function buildAll() {
  return runAllTask('build', 1);
}

/**
 * Test all (apps + modules).
 *
 * @returns {Promise<void>}
 * @example
 * await testAll();
 */
export async function testAll() {
  return runAllTask('test', 1);
}

/**
 * Lint all (apps + modules) in the monorepo.
 *
 * @param {string[]} [options=[]] - Extra CLI args (e.g., `--fix`).
 * @returns {Promise<void>}
 * @example
 * await lintAll(['--quiet']);
 */
export async function lintAll(options = []) {
  return withWorkspaces(() =>
    runTaskFromRoot('lint (all: apps + modules)', 'yarn', ['pm:lint:base', ...options]),
  );
}

/**
 * Build the documentation workspace.
 *
 * @returns {Promise<void>}
 * @example
 * await buildDocs();
 */
export async function buildDocs() {
  return withWorkspaces(() =>
    runTaskFromRoot('docs build', 'yarn', [
      'workspace',
      '@ovh-ux/manager-documentation',
      'run',
      'docs:build',
    ]),
  );
}

/**
 * Run the manager-migration-cli workspace command.
 *
 * @param {string[]} [options=[]] - CLI args forwarded to manager-migration-cli.
 * @returns {Promise<void>}
 * @example
 * await runManagerCli(['--migrations-status']);
 */
export async function runManagerCli(options = []) {
  return withWorkspaces(() =>
    runTaskFromRoot('manager-migration-cli', 'yarn', [
      'workspace',
      '@ovh-ux/manager-migration-cli',
      'run',
      'manager-migration-cli',
      ...options,
    ]),
  );
}

/**
 * Publish all packages.
 *
 * @param {string[]} [options=[]] - CLI args forwarded to `scripts/publish.js`.
 * @returns {Promise<void>}
 * @example
 * await publishPackage(['--tag', 'latest']);
 */
export async function publishPackage(options = []) {
  return withWorkspaces(() =>
    runTaskFromRoot('packages:publish', 'node', ['scripts/publish.js', ...options]),
  );
}

/**
 * Create a release.
 *
 * @param {string[]} [options=[]] - CLI args forwarded to `scripts/release/release.sh`.
 * @returns {Promise<void>}
 * @example
 * await createRelease(['--tag', 'v1.3.0']);
 */
export async function createRelease(options = []) {
  return withWorkspaces(() =>
    runTaskFromRoot('release', 'bash', ['scripts/release/release.sh', ...options]),
  );
}

/**
 * Run a preinstall or postinstall lifecycle script.
 *
 * @param {"preinstall"|"postinstall"} lifecycle - Lifecycle stage name.
 * @returns {Promise<void>}
 * @throws {Error} If the lifecycle script is unknown.
 * @example
 * await runLifecycleTask('preinstall');
 */
export async function runLifecycleTask(lifecycle) {
  const scripts = {
    preinstall: './packages/manager-tools/manager-pm/src/manager-pm-preinstall.js',
    postinstall: './packages/manager-tools/manager-pm/src/manager-pm-postinstall.js',
  };

  const script = scripts[lifecycle];
  if (!script) throw new Error(`Unknown lifecycle: ${lifecycle}`);

  return runTaskFromRoot(lifecycle, 'node', [script]);
}

/**
 * Run static + dynamic quality checks (report mode).
 *
 * @returns {Promise<void>}
 * @example
 * await runStaticDynamicReports();
 */
export async function runStaticDynamicReports() {
  return withWorkspaces(() =>
    runTaskFromRoot('static-dynamic-reports', 'manager-static-dynamic-quality-checks'),
  );
}

/**
 * Run static + dynamic quality checks (test mode).
 *
 * @returns {Promise<void>}
 * @example
 * await runStaticDynamicTests();
 */
export async function runStaticDynamicTests() {
  return withWorkspaces(() =>
    runTaskFromRoot('static-dynamic-tests', 'manager-static-dynamic-quality-checks', ['--tests']),
  );
}

/**
 * Run performance budgets checks.
 *
 * @param {string[]} [options=[]] - CLI args such as `--packages web,cloud`.
 * @returns {Promise<void>}
 * @example
 * await runPerfBudgets(['--app', 'web']);
 */
export async function runPerfBudgets(options = []) {
  return withWorkspaces(() => runTaskFromRoot('perf-budgets', 'manager-perf-budgets', options));
}

/**
 * Run arbitrary Lerna commands with workspace setup.
 *
 * @param {string[]} [options=[]] - Arguments for the `lerna` binary.
 * @returns {Promise<void>}
 * @example
 * await runLernaTask(['list', '--json']);
 */
export async function runLernaTask(options = []) {
  return withWorkspaces(async () => {
    await runCommand('node_modules/.bin/lerna', options, managerRootPath);
  });
}
