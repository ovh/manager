import { managerRootPath } from '../../playbook/playbook-config.js';
import { buildNxCiArgs, isNxRunner } from '../utils/nx-utils.js';
import {
  resolveApplicationBuildFilter,
  resolveModuleBuildFilter,
  runCommand,
  runTaskFromRoot,
} from '../utils/tasks-utils.js';
import { clearRootWorkspaces, updateRootWorkspacesFromCatalogs } from '../utils/workspace-utils.js';

const DEFAULT_RUNNER = 'turbo';

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
 * Build arguments for CI tasks (global build/test) depending on the chosen runner.
 *
 * - For turbo (and unknown runners): `runner run <task> ...options`
 * - For nx:
 *    - directory/name filters: use `nx run-many --target=<task> --projects=...`
 *      and map `--concurrency` → `--parallel`
 *    - git filters like [HEAD^1] / [base...head]: use `nx affected --target=<task>`
 *
 * @param {string} runner
 * @param {"build"|"test"} task
 * @param {string[]} options
 * @returns {string[]}
 */
function getCiRunnerArgs(runner, task, options = []) {
  // Turbo and other runners: keep arguments as-is
  if (!isNxRunner(runner)) {
    return ['run', task, ...options];
  }

  return buildNxCiArgs(task, options);
}

/**
 * Build arguments for single-target tasks (module/app) depending on the runner.
 *
 * - For turbo (and unknown): `runner run <task> --concurrency=N --continue=always --filter <filter>`
 * - For nx: `nx run <project>:<task> --parallel=N`
 *
 * @param {string} runner
 * @param {"build"|"test"|"lint"|string} task
 * @param {string} projectOrFilter
 * @param {number} concurrency
 * @returns {string[]}
 */
function getSingleRunnerArgs(runner, task, projectOrFilter, concurrency = 1) {
  if (isNxRunner(runner)) {
    // Assumption: projectOrFilter is the Nx project name
    return ['run', `${projectOrFilter}:${task}`, `--parallel=${concurrency}`];
  }

  // Default (turbo and others): use turbo-style filter
  return [
    'run',
    task,
    `--concurrency=${concurrency}`,
    '--continue=always',
    '--filter',
    projectOrFilter,
  ];
}

/**
 * Build arguments for "all" tasks (build all / test all) depending on the runner.
 *
 * - For turbo (and unknown): `runner run <task> --concurrency=N --continue=always`
 * - For nx: `nx run-many --target=<task> --all --parallel=N`
 *
 * @param {string} runner
 * @param {"build"|"test"|"lint"|string} task
 * @param {number} concurrency
 * @returns {string[]}
 */
function getAllRunnerArgs(runner, task, concurrency = 1) {
  if (isNxRunner(runner)) {
    return ['run-many', `--target=${task}`, '--all', `--parallel=${concurrency}`];
  }

  // Default (turbo and others)
  return ['run', task, `--concurrency=${concurrency}`, '--continue=always'];
}

/**
 * Run a turbo/nx/.. task (`build` or `test`) in CI mode with optional CLI arguments.
 *
 * @param {"build"|"test"|"lint"} task
 * @param {string[]} [options=[]] - Extra CLI args passed to the runner.
 * @param {string} [runner="turbo"] - "turbo", "nx", ...
 */
export async function runCITask(task, options = [], runner = DEFAULT_RUNNER) {
  return withWorkspaces(async () => {
    const args = getCiRunnerArgs(runner, task, options);
    await runTaskFromRoot(`${task} (CI:${runner})`, runner, args);
  });
}

/**
 * Run a turbo/nx/.. task (e.g., `build` or `test`) for a **specific module only**.
 *
 * @param {"build"|"test"|"lint"|string} task
 * @param {string} targetReference
 * @param {number} [concurrency=1]
 * @param {string} [runner="turbo"] - Task runner binary ("turbo", "nx", ...)
 */
async function runModuleTask(task, targetReference, concurrency = 1, runner = DEFAULT_RUNNER) {
  if (!targetReference) {
    throw new Error(
      `runModuleTask: missing target reference. This function requires an explicit module reference.`,
    );
  }

  return withWorkspaces(async () => {
    const projectOrFilter = resolveModuleBuildFilter(targetReference);

    if (!projectOrFilter) {
      throw new Error(`Unable to resolve build filter for module "${targetReference}"`);
    }

    const args = getSingleRunnerArgs(runner, task, projectOrFilter, concurrency);
    await runTaskFromRoot(`${task} (${targetReference})`, runner, args);
  });
}

/**
 * Run a turbo/nx/.. task (e.g., `build` or `test`) for a **specific application only**.
 *
 * @param {"build"|"test"|"lint"|string} task
 * @param {string} targetReference
 * @param {number} [concurrency=1]
 * @param {string} [runner="turbo"]
 */
async function runApplicationTask(task, targetReference, concurrency = 1, runner = DEFAULT_RUNNER) {
  if (!targetReference) {
    throw new Error(
      `runApplicationTask: missing target reference. This function requires an explicit app reference.`,
    );
  }

  return withWorkspaces(async () => {
    const projectOrFilter = resolveApplicationBuildFilter(targetReference);

    if (!projectOrFilter) {
      throw new Error(`Unable to resolve build filter for application "${targetReference}"`);
    }

    const args = getSingleRunnerArgs(runner, task, projectOrFilter, concurrency);
    await runTaskFromRoot(`${task} (${targetReference})`, runner, args);
  });
}

/**
 * Run a turbo/nx/.. task across **all applications and modules**.
 *
 * @param {"build"|"test"|"lint"|string} task
 * @param {number} [concurrency=1]
 * @param {string} [runner="turbo"]
 */
async function runAllTask(task, concurrency = 1, runner = DEFAULT_RUNNER) {
  return withWorkspaces(async () => {
    const args = getAllRunnerArgs(runner, task, concurrency);
    await runTaskFromRoot(`${task} (all: apps + modules)`, runner, args);
  });
}

/**
 * Build all targets in CI mode with a given runner (default: turbo).
 *
 * @async
 * @param {string[]} [options=[]] - turbo/nx/.. CLI options.
 * @param {"turbo"|"nx"|string} [runner="turbo"] - Task runner binary to invoke.
 * @returns {Promise<void>}
 * @example
 * await buildCI(['--filter=@ovh-ux/manager-web'], 'nx');
 */
export async function buildCI(options = [], runner = DEFAULT_RUNNER) {
  return runCITask('build', options, runner);
}

/**
 * Run tests in CI mode with a given runner (default: turbo).
 *
 * @async
 * @param {string[]} [options=[]] - turbo/nx/.. CLI options.
 * @param {"turbo"|"nx"|string} [runner="turbo"] - Task runner binary to invoke.
 * @returns {Promise<void>}
 * @example
 * await testCI(['--filter=tag:unit'], 'nx');
 */
export async function testCI(options = [], runner = DEFAULT_RUNNER) {
  return runCITask('test', options, runner);
}

/**
 * Run lint in CI mode with a given runner (default: turbo).
 *
 * @async
 * @param {string[]} [options=[]] - turbo/nx/.. CLI options.
 * @param {"turbo"|"nx"|string} [runner="turbo"] - Task runner binary to invoke.
 * @returns {Promise<void>}
 * @example
 * await lintCI(['--filter=tag:unit'], 'nx');
 */
export async function lintCI(options = [], runner = DEFAULT_RUNNER) {
  await runCITask('lint', options, runner);
}

/**
 * Build a single module.
 *
 * @param {string} moduleRef - Module reference or package name.
 * @param {string} [runner="turbo"] - Task runner to use Turbo/NX/...
 * @returns {Promise<void>}
 * @example
 * await buildModule('@ovh-ux/manager-core-api');
 */
export async function buildModule(moduleRef, runner = DEFAULT_RUNNER) {
  return runModuleTask('build', moduleRef, 1, runner);
}

/**
 * Test a single module.
 *
 * @param {string} moduleRef - Module reference or package name.
 * @param {string} [runner="turbo"] - Task runner to use Turbo/NX/...
 * @returns {Promise<void>}
 * @example
 * await testModule('packages/manager/core/api');
 */
export async function testModule(moduleRef, runner = DEFAULT_RUNNER) {
  return runModuleTask('test', moduleRef, 1, runner);
}

/**
 * Lint a single module.
 *
 * @param {string} moduleRef - Module reference or package name.
 * @param {string} [runner="turbo"] - Task runner to use Turbo/NX/...
 * @returns {Promise<void>}
 * @example
 * await lintModule('packages/manager/core/api');
 */
export async function lintModule(moduleRef, runner = DEFAULT_RUNNER) {
  return runModuleTask('lint', moduleRef, 1, runner);
}

/**
 * Build a single application.
 *
 * @param {string} appRef - Application reference or package name.
 * @param {string} [runner="turbo"] - Task runner to use Turbo/NX/...
 * @returns {Promise<void>}
 * @example
 * await buildApplication('web');
 */
export async function buildApplication(appRef, runner = DEFAULT_RUNNER) {
  return runApplicationTask('build', appRef, 1, runner);
}

/**
 * Run tests for a single application.
 *
 * @param {string} appRef - Application reference or package name.
 * @param {string} [runner="turbo"] - Task runner to use Turbo/NX/...
 * @returns {Promise<void>}
 * @example
 * await testApplication('@ovh-ux/manager-web');
 */
export async function testApplication(appRef, runner = DEFAULT_RUNNER) {
  return runApplicationTask('test', appRef, 1, runner);
}

/**
 * Run lint for a single application.
 *
 * @param {string} appRef - Application reference or package name.
 * @param {string} [runner="turbo"] - Task runner to use Turbo/NX/...
 * @returns {Promise<void>}
 * @example
 * await lintApplication('@ovh-ux/manager-web');
 */
export async function lintApplication(appRef, runner = DEFAULT_RUNNER) {
  return runApplicationTask('lint', appRef, 1, runner);
}

/**
 * Build all (apps + modules).
 *
 * @param {string} [runner="turbo"] - Task runner to use Turbo/NX/...
 * @returns {Promise<void>}
 * @example
 * await buildAll();
 */
export async function buildAll(runner = DEFAULT_RUNNER) {
  return runAllTask('build', 1, runner);
}

/**
 * Test all (apps + modules).
 *
 * @param {string} [runner="turbo"] - Task runner to use Turbo/NX/...
 * @returns {Promise<void>}
 * @example
 * await testAll();
 */
export async function testAll(runner = DEFAULT_RUNNER) {
  return runAllTask('test', 1, runner);
}

/**
 * Lint all (apps + modules).
 *
 * @param {string} [runner="turbo"] - Task runner to use Turbo/NX/...
 * @returns {Promise<void>}
 * @example
 * await lintAll();
 */
export async function lintAll(runner = DEFAULT_RUNNER) {
  return runAllTask('lint', 1, runner);
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
    runTaskFromRoot('static-dynamic-reports', 'manager-static-dynamic-quality-checks', []),
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
