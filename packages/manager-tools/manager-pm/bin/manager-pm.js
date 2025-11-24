#!/usr/bin/env node
/* eslint-disable max-lines */
/**
 * @fileoverview manager-pm CLI entrypoint.
 *
 * Provides a simple argument parser and dispatcher for actions like
 * build, test, lint, CI tasks, docs, manager-migration-cli passthrough,
 * workspace management, publishing, release, and lifecycle hooks.
 * Supports forwarding arbitrary Task Manager CLI flags.
 */
import process from 'node:process';

import {
  buildAll,
  buildApplication,
  buildCI,
  buildDocs,
  buildModule,
  createRelease,
  lintAll,
  lintApplication,
  lintModule,
  publishPackage,
  runLernaTask,
  runLifecycleTask,
  runManagerCli,
  runPerfBudgets,
  runStaticDynamicReports,
  runStaticDynamicTests,
  testAll,
  testApplication,
  testCI,
  testModule,
} from '../src/kernel/helpers/tasks-helper.js';
import { startApp } from '../src/kernel/pnpm/pnpm-start-app.js';
import { logger, setLoggerMode } from '../src/kernel/utils/log-manager.js';
import {
  attachCleanupSignals,
  handleProcessAbortSignals,
} from '../src/kernel/utils/process-utils.js';
import {
  clearRootWorkspaces,
  updateRootWorkspacesFromCatalogs,
} from '../src/kernel/utils/workspace-utils.js';

const VERSION = '0.2.0';
const DEFAULT_RUNNER = 'turbo';

/**
 * Parse CLI arguments into options, rest args, and passthrough.
 *
 * Supported forms:
 *   --foo bar   → opts.foo = "bar"
 *   --flag      → opts.flag = true
 *   -x y        → opts.x = "y"
 *   -abc        → opts.a = true, opts.b = true, opts.c = true
 * Everything after `--` is passthrough.
 *
 * @param {string[]} argv - Command-line arguments (excluding node + script).
 * @returns {{opts: Record<string, string|boolean>, rest: string[], passthrough: string[]}}
 */
function parseArgs(argv) {
  const opts = {};
  const rest = [];
  let passthrough = [];

  const dashdash = argv.indexOf('--');
  if (dashdash !== -1) {
    passthrough = argv.slice(dashdash + 1);
    argv = argv.slice(0, dashdash);
  }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('-')) {
        opts[key] = next;
        i++;
      } else {
        opts[key] = true;
      }
    } else if (arg.startsWith('-') && arg.length > 1) {
      const letters = arg.slice(1).split('');
      if (letters.length > 1) {
        letters.forEach((l) => (opts[l] = true));
      } else {
        const key = letters[0];
        const next = argv[i + 1];
        if (next && !next.startsWith('-')) {
          opts[key] = next;
          i++;
        } else {
          opts[key] = true;
        }
      }
    } else {
      rest.push(arg);
    }
  }

  return { opts, rest, passthrough };
}

/**
 * Human-readable CLI help text for manager-pm.
 *
 * Includes usage, actions, common options, publish/release flags, examples, and notes.
 * Update this string when adding or removing actions so `printHelp()` stays in sync.
 *
 * @constant
 * @type {string}
 */
const HELP_TEXT = `
manager-pm — monorepo task runner

USAGE
  manager-pm [--type pnpm] --action <action> [options]
  manager-pm --help

ACTIONS
  Single-app:
    build   --app <name>                 Build one app
    test    --app <name>                 Test one app
    lint    --app <name> [--fix ...]     Lint one app (supports --fix and other ESLint flags)

  Module:
    add:module     --module <package|path> [--private]     Add a module (optionally private) to PNPM
    remove:module  --module <package|path> [--private]     Remove a module (optionally private) from PNPM

  Task manager passthrough (flags forwarded to Turbo/NX/...):
    buildCI [--filter <expr>] [other flags]
    testCI  [--filter <expr>] [other flags]

  Lerna passthrough (flags forwarded to Lerna):
    lerna <subcommand> [options]         Run any Lerna command with workspaces restored/cleaned

  Global:
    full-build                           Build ALL
    full-test                            Test ALL
    full-lint [--fix ...]                Lint ALL (supports --fix and other ESLint flags)
    start                                Launch interactive app starter
    docs                                 Build documentation workspace
    cli                                  Run manager-migration-cli (everything after "cli" is forwarded)
    workspace --mode <prepare|remove>    Prepare or clear root workspaces

  Publishing & Release:
    publish                              Publish all packages (scripts/publish.js)
    release                              Create a release (scripts/release/release.sh)

  Lifecycle:
    preinstall                           Run preinstall lifecycle hook
    postinstall                          Run postinstall lifecycle hook

  Static & Performance:
    staticDynamicReports                 Run static + dynamic checks (reports)
    perfBudgets [--packages <list>]      Run performance budgets check for selected packages
    staticDynamicTests                   Run static + dynamic checks (tests)

COMMON OPTIONS
  --type <pnpm>                          Package manager type (default: pnpm)
  --action <name>                        Action to execute
  --app <name>                           App/package name (build/test/lint single-app)
  --module <name|path>                   Module name or path (add:module/remove:module)
  --filter <expr>                        Task manager (Turbo/NX/...) filter for buildCI/testCI
  --runner <turbo|nx|binary>             Task runner binary (default: turbo)
  --container                            Hint that we run inside a container
  --region <code>                        Region flag (printed for logs only)
  --silent                               Suppress ALL logs (stderr + stdout), only raw tool output remains

LINTING FLAGS (forwarded to ESLint / lint runner)
  --fix                                  Automatically fix lint errors where possible
  --max-warnings <n>                     Set maximum allowed warnings (default: no limit)
  --quiet                                Report only errors (ignore warnings)
  (Any other flags are forwarded directly to the lint runner)

RELEASE / PUBLISH FLAGS (forwarded to underlying tools)
  --dry-run | --dryrun | -n              DRY MODE
                                         • publish: uses "npm publish --dry-run" (no registry write)
                                         • release: non-mutating — no smoke tags, no commits/push,
                                           no file changes persist (working tree is restored)
  --tag <name>                           Dist-tag (publish) or explicit release tag (release)
  --seed <value>                         Seed used to compute release name
  --conventional-prerelease              Forwarded to lerna (release)
  --preid <id>                           e.g. rc, alpha (with --conventional-prerelease)
  (Any other unknown flags are forwarded to Turbo / lerna / npm / yarn as appropriate)

EXAMPLES
  # Single app
  manager-pm --type pnpm --action build --app web
  manager-pm --type pnpm --action test  --app web
  manager-pm --type pnpm --action lint  --app web --fix
  manager-pm --type pnpm --action lint  --app web --max-warnings 0

  # Module management
  manager-pm --type pnpm --action build --module packages/manager/core/api
  manager-pm --type pnpm --action test  --module @ovh-ux/manager-core-api
  manager-pm --type pnpm --action lint  --module packages/manager/core/application  --fix
  manager-pm --type pnpm --action lint  --module @ovh-ux/manager-core-utils --max-warnings 0

  # Lint all
  manager-pm --type pnpm --action full-lint
  manager-pm --type pnpm --action full-lint --fix
  manager-pm --type pnpm --action full-lint --quiet --max-warnings 0

  # Task manager (Turbo/NX/...) passthrough
  manager-pm --type pnpm --action buildCI --filter=@ovh-ux/manager-web
  manager-pm --type pnpm --action testCI  --filter=tag:unit --parallel

  # Lerna passthrough
  manager-pm --action lerna list --all --json --toposort
  manager-pm --action lerna publish from-package --yes
  manager-pm --action lerna version --conventional-commits

  # Workspaces
  manager-pm --action workspace --mode prepare
  manager-pm --action workspace --mode remove

  # manager-migration-cli passthrough
  manager-pm --type pnpm --action cli migrations-status --type all

  # Reports
  yarn manager-pm --type pnpm --action staticDynamicReports
  yarn manager-pm --type pnpm --action perfBudgets --packages web,cloud

  # Tests
  yarn manager-pm --type pnpm --action staticDynamicTests

  # Publish (dry + real)
  manager-pm --type pnpm --action publish --dry-run
  manager-pm --type pnpm --action publish --dry-run --tag v1.2.3
  manager-pm --type pnpm --action publish --access public --tag latest

  # Release (dry + real)
  manager-pm --type pnpm --action release --dry-run
  manager-pm --type pnpm --action release --tag v1.2.3
  manager-pm --type pnpm --action release --conventional-prerelease --preid rc

NOTES
  • Exit codes: 0 on success, non-zero on failure.
  • Module actions support both workspace paths and package names.
  • Lint actions support --fix, --quiet, and other ESLint-compatible flags.
  • In dry release mode, the script safeguards your working tree: no tags/commits/push,
    no persistent file changes (package.json/CHANGELOG restored).
  • For "cli" action, everything after the word "cli" is forwarded to manager-migration-cli verbatim.
  • For "lerna" action, everything after the word "lerna" is forwarded to Lerna verbatim.
`;

/**
 * Print the CLI help text.
 *
 * @returns {void}
 */
function printHelp() {
  logger.info(HELP_TEXT);
}

/**
 * Exit with error message.
 * @param {string} msg - Error message to log.
 * @returns {never}
 */
function exitError(msg) {
  logger.error(msg);
  process.exit(1);
}

/**
 * Collect extra CLI options to forward to internal tools.
 *
 * @param {Record<string, string|boolean>} opts - Parsed CLI options.
 * @param {boolean} includeApp - Whether to forward --app / --packages.
 * @returns {string[]} Array of CLI flags.
 */
function collectToolsArgs(opts, includeApp = false) {
  const alwaysExcluded = ['action', 'type', 'filter', 'region', 'mode', 'container', 'runner'];
  const excluded = includeApp ? alwaysExcluded : [...alwaysExcluded, 'app', 'packages'];

  return Object.entries(opts)
    .filter(([k]) => !excluded.includes(k))
    .flatMap(([k, v]) => (typeof v === 'boolean' ? [`--${k}`] : [`--${k}`, v]));
}

/**
 * Wrapper around collectToolsArgs that also optionally strips --silent.
 *
 * @param {Record<string, string|boolean>} opts
 * @param {{ includeApp?: boolean, stripSilent?: boolean }} [options]
 * @returns {string[]}
 */
function collectForwardedArgs(opts, { includeApp = false, stripSilent = true } = {}) {
  const base = collectToolsArgs(opts, includeApp);
  if (!stripSilent) return base;
  return base.filter((arg) => arg !== '--silent');
}

/**
 * Resolve the task runner (turbo/nx/...) from CLI options.
 *
 * @param {Record<string, string|boolean>} opts
 * @returns {string} runner binary name
 */
function resolveRunner(opts) {
  const runnerValue = opts.runner;
  if (typeof runnerValue === 'string' && runnerValue.trim()) {
    return runnerValue.trim();
  }
  return DEFAULT_RUNNER;
}

/**
 * Resolve base CLI arguments for CI commands.
 *
 * Priority:
 *  1. If `passthrough` is non-empty, use it as-is.
 *  2. Otherwise, if `filter` is provided, use a Turbo-style filter pair: ['--filter', filter].
 *  3. Otherwise, return an empty array.
 *
 * This lets callers override the default filter behavior by passing explicit passthrough args.
 *
 * @param {Object} params
 * @param {string[]} [params.passthrough=[]] - Raw arguments to forward directly to the runner.
 * @param {string} [params.filter] - Turbo/Nx-compatible filter expression (e.g. package name, path, or range).
 * @returns {string[]} Resolved base arguments to prepend before forwarded options.
 */
function resolveBaseArgs({ passthrough = [], filter }) {
  if (passthrough.length > 0) {
    return passthrough;
  }

  if (filter) {
    return ['--filter', filter];
  }

  return [];
}

/**
 * Map of supported CLI actions to their async handlers.
 * Each handler receives the parsed CLI context.
 *
 * @type {Record<string, (ctx: {app?: string, module?: string, passthrough: string[], filter?: string|null, mode?: string, opts: Record<string, string|boolean>}) => Promise<void>>}
 */
const actions = {
  async build({ app, module, opts }) {
    if (!app && !module) {
      exitError(`Action "build" requires either --app or --module`);
    }

    const runner = resolveRunner(opts);

    if (app) {
      logger.info(`🏗️  Building application: ${app} (runner: ${runner})`);
      return buildApplication(app, runner);
    }
    if (module) {
      logger.info(`📦 Building module: ${module} (runner: ${runner})`);
      return buildModule(module, runner);
    }
  },
  async test({ app, module, opts }) {
    if (!app && !module) {
      exitError(`Action "test" requires either --app or --module`);
    }

    const runner = resolveRunner(opts);

    if (app) {
      logger.info(`🧪 Testing application: ${app} (runner: ${runner})`);
      return testApplication(app, runner);
    }
    if (module) {
      logger.info(`🧩 Testing module: ${module} (runner: ${runner})`);
      return testModule(module, runner);
    }
  },
  async lint({ app, module, passthrough, opts }) {
    if (!app && !module) {
      exitError(`Action "lint" requires either --app or --module`);
    }

    const runner = resolveRunner(opts);
    const forwarded = collectToolsArgs(opts).filter((arg) => arg !== '--silent');

    if (app) {
      logger.info(`🧹 Linting application: ${app} (runner: ${runner})`);
      return lintApplication(app, [...forwarded, ...passthrough], runner);
    }
    if (module) {
      logger.info(`🔍 Linting module: ${module} (runner: ${runner})`);
      return lintModule(module, [...forwarded, ...passthrough], runner);
    }
  },
  async start() {
    return startApp();
  },
  async 'full-build'({ opts }) {
    const runner = resolveRunner(opts);
    logger.info(`🏗️  Building ALL apps + modules (runner: ${runner})`);
    return buildAll(runner);
  },
  async 'full-test'({ opts }) {
    const runner = resolveRunner(opts);
    logger.info(`🧪 Testing ALL apps + modules (runner: ${runner})`);
    return testAll(runner);
  },
  async 'full-lint'({ passthrough, opts }) {
    const runner = resolveRunner(opts);
    const forwarded = collectToolsArgs(opts).filter((arg) => arg !== '--silent');
    logger.info(`🧹 Linting ALL apps + modules (runner: ${runner})`);
    return lintAll([...forwarded, ...passthrough], runner);
  },
  async docs() {
    return buildDocs();
  },
  async staticDynamicReports() {
    return runStaticDynamicReports();
  },
  async staticDynamicTests() {
    return runStaticDynamicTests();
  },
  async workspace({ mode }) {
    if (!mode) {
      exitError(`Action "workspace" requires --mode <prepare|remove>`);
    }
    if (mode === 'prepare') {
      await updateRootWorkspacesFromCatalogs();
      logger.info('✅ Root workspaces prepared from catalogs.');
    } else if (mode === 'remove') {
      await clearRootWorkspaces();
      logger.info('✅ Root workspaces cleared.');
    } else {
      exitError(`❌ Unknown workspace mode: "${mode}" (expected prepare|remove)`);
    }
  },
  async preinstall() {
    return runLifecycleTask('preinstall');
  },
  async postinstall() {
    return runLifecycleTask('postinstall');
  },
  async buildCI({ passthrough, filter, opts }) {
    const runner = resolveRunner(opts);
    const base = resolveBaseArgs({ passthrough, filter });
    const forwarded = collectForwardedArgs(opts);

    return buildCI([...base, ...forwarded], runner);
  },
  async testCI({ passthrough, filter, opts }) {
    const runner = resolveRunner(opts);
    const base = resolveBaseArgs({ passthrough, filter });
    const forwarded = collectForwardedArgs(opts);

    return testCI([...base, ...forwarded], runner);
  },
  async perfBudgets({ passthrough, opts }) {
    const forwarded = collectForwardedArgs(opts, { includeApp: true });
    return runPerfBudgets([...forwarded, ...passthrough]);
  },
  async publish({ opts }) {
    const forwarded = collectForwardedArgs(opts);
    return publishPackage(forwarded);
  },
  async release({ opts }) {
    // Collect everything except internal flags, then normalize special short flags
    const forwarded = collectForwardedArgs(opts);
    const normalized = forwarded.map((arg) => {
      if (arg === '--d') return '-d';
      if (arg === '--s') return '-s';
      return arg;
    });

    return createRelease(normalized);
  },
  async cli() {
    // Everything after "cli" is forwarded directly to manager-migration-cli
    const cliIndex = process.argv.indexOf('cli');
    let extraArgs = cliIndex !== -1 ? process.argv.slice(cliIndex + 1) : [];

    // Strip --silent before passing to manager-migration-cli
    if (extraArgs.includes('--silent')) {
      extraArgs = extraArgs.filter((arg) => arg !== '--silent');
      setLoggerMode('silent');
    }

    return runManagerCli(extraArgs);
  },
  async lerna() {
    const lernaIndex = process.argv.indexOf('lerna');
    let extraArgs = lernaIndex !== -1 ? process.argv.slice(lernaIndex + 1) : [];

    // Strip --silent before passing to Lerna
    if (extraArgs.includes('--silent')) {
      extraArgs = extraArgs.filter((arg) => arg !== '--silent');
      setLoggerMode('silent');
    }

    return runLernaTask(extraArgs);
  },
};

/**
 * Configure logger mode based on CLI flags.
 */
function configureLoggerMode() {
  if (process.argv.includes('--silent')) {
    setLoggerMode('silent');
  } else {
    setLoggerMode('stderr'); // Safe default for jq pipes
  }
}

/**
 * Validate base CLI arguments and handle global flags (help, version).
 * Exits the process early if needed.
 *
 * @param {Record<string, string|boolean>} opts - Parsed options.
 * @param {string[]} passthrough - Remaining CLI args.
 */
async function handleGlobalFlags(opts, passthrough) {
  const { action } = opts;

  if (!action) {
    printHelp();
    process.exit(0);
  }

  if (opts.version || opts.V) {
    logger.info(`manager-pm v${VERSION}`);
    process.exit(0);
  }

  if (action === 'cli' && (passthrough.includes('--help') || passthrough.includes('-h'))) {
    await runManagerCli(['--help']);
    process.exit(0);
  }
}

/**
 * Log the current CLI context for debugging and visibility.
 */
function logExecutionContext({
  type,
  action,
  appReference,
  moduleReference,
  filter,
  region,
  container,
  mode,
  runner,
}) {
  logger.info(`manager-pm v${VERSION}
type: ${type}
action: ${action}
runner: ${runner}
app: ${appReference || '(none)'}
module: ${moduleReference || '(none)'}
filter: ${filter || '(none)'}
region: ${region}
container: ${container}
mode: ${mode || '(none)'}`);
}

/**
 * Execute a CLI action safely, handling errors and exit codes.
 */
async function executeAction(actionName, context) {
  const actionHandler = actions[actionName];
  if (!actionHandler) {
    logger.warn(`⚠️  Unknown action: "${actionName}"`);
    printHelp();
    process.exit(1);
  }

  try {
    await actionHandler(context);
    process.exit(0);
  } catch (error) {
    logger.error(error?.stack || error?.message || String(error));
    process.exit(1);
  }
}

/**
 * CLI entrypoint.
 * Parses args, validates options, and dispatches actions.
 */
async function main() {
  const { opts, passthrough } = parseArgs(process.argv.slice(2));

  configureLoggerMode();

  const {
    action,
    type = 'pnpm',
    app: appReference = null,
    module: moduleReference = null,
    filter = null,
    region = 'EU',
    mode = null,
  } = opts;

  const container = Boolean(opts.container);
  const runner = resolveRunner(opts);

  // Handle help, version, and CLI passthroughs
  await handleGlobalFlags(opts, passthrough);

  // Log CLI context summary
  logExecutionContext({
    type,
    action,
    appReference,
    moduleReference,
    filter,
    region,
    container,
    mode,
    runner,
  });

  // Execute the corresponding action handler
  await executeAction(action, {
    app: appReference,
    module: moduleReference,
    passthrough,
    filter,
    mode,
    opts,
  });
}

// Attach handlers for signals and unhandled errors
attachCleanupSignals(handleProcessAbortSignals);

// ---- Run CLI ----
main().catch(async (err) => {
  await handleProcessAbortSignals('unhandled rejection', err);
});
