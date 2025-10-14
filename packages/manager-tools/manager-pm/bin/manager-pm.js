#!/usr/bin/env node
/* eslint-disable max-lines */
/**
 * @fileoverview manager-pm CLI entrypoint.
 *
 * Provides a simple argument parser and dispatcher for actions like
 * build, test, lint, CI tasks, docs, manager-cli passthrough,
 * workspace management, publishing, release, and lifecycle hooks.
 * Supports forwarding arbitrary Turbo CLI flags.
 */
import process from 'node:process';

import {
  buildAll,
  buildApp,
  buildCI,
  buildDocs,
  createRelease,
  lintAll,
  lintApp,
  publishPackage,
  runLernaTask,
  runLifecycleTask,
  runManagerCli,
  runPerfBudgets,
  runStaticDynamicReports,
  runStaticDynamicTests,
  testAll,
  testApp,
  testCI,
} from '../src/kernel/commons/tasks-manager.js';
import { startApp } from '../src/kernel/pnpm/pnpm-start-app.js';
import {
  clearRootWorkspaces,
  updateRootWorkspacesFromCatalogs,
} from '../src/kernel/utils/catalog-utils.js';
import { logger, setLoggerMode } from '../src/kernel/utils/log-manager.js';

const VERSION = '0.2.0';

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

  Turbo passthrough (flags forwarded to Turbo):
    buildCI [--filter <expr>] [other turbo flags]
    testCI  [--filter <expr>] [other turbo flags]

  Lerna passthrough (flags forwarded to Lerna):
    lerna <subcommand> [options]         Run any Lerna command with workspaces restored/cleaned

  Global:
    full-build                           Build ALL apps
    full-test                            Test ALL apps
    full-lint [--fix ...]                Lint ALL apps (supports --fix and other ESLint flags)
    start                                Launch interactive app starter
    docs                                 Build documentation workspace
    cli                                  Run manager-cli (everything after "cli" is forwarded)
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
  --filter <expr>                        Turbo filter for buildCI/testCI
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
  (Any other unknown flags are forwarded to Turbo / lerna / npm/yarn as appropriate)

EXAMPLES
  # Single app
  manager-pm --type pnpm --action build --app web
  manager-pm --type pnpm --action test  --app web
  manager-pm --type pnpm --action lint  --app web --fix
  manager-pm --type pnpm --action lint  --app web --max-warnings 0

  # Lint all apps
  manager-pm --type pnpm --action full-lint
  manager-pm --type pnpm --action full-lint --fix
  manager-pm --type pnpm --action full-lint --quiet --max-warnings 0

  # Turbo passthrough
  manager-pm --type pnpm --action buildCI --filter=@ovh-ux/manager-web
  manager-pm --type pnpm --action testCI  --filter=tag:unit --parallel

  # Lerna passthrough
  manager-pm --action lerna list --all --json --toposort
  manager-pm --action lerna publish from-package --yes
  manager-pm --action lerna version --conventional-commits

  # Workspaces
  manager-pm --action workspace --mode prepare
  manager-pm --action workspace --mode remove

  # manager-cli passthrough
  manager-pm --type pnpm --action cli -- migrations-status --type all

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
  • Lint actions support --fix, --quiet, and other ESLint-compatible flags.
  • In dry release mode, the script safeguards your working tree: no tags/commits/push,
    no persistent file changes (package.json/CHANGELOG restored).
  • For "cli" action, everything after the word "cli" is forwarded to manager-cli verbatim.
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
  const alwaysExcluded = ['action', 'type', 'filter', 'region', 'mode', 'container'];
  const excluded = includeApp ? alwaysExcluded : [...alwaysExcluded, 'app', 'packages'];

  return Object.entries(opts)
    .filter(([k]) => !excluded.includes(k))
    .flatMap(([k, v]) => (typeof v === 'boolean' ? [`--${k}`] : [`--${k}`, v]));
}

/**
 * Map of supported CLI actions to their async handlers.
 * Each handler receives the parsed CLI context.
 *
 * @type {Record<string, (ctx: {app?: string, passthrough: string[], filter?: string|null, mode?: string, opts: Record<string, string|boolean>}) => Promise<void>>}
 */
const actions = {
  async build({ app }) {
    if (!app) exitError(`Action "build" requires --app`);
    return buildApp(app);
  },
  async test({ app }) {
    if (!app) exitError(`Action "test" requires --app`);
    return testApp(app);
  },
  async lint({ app, passthrough, opts }) {
    if (!app) exitError(`Action "lint" requires --app`);
    const forwarded = collectToolsArgs(opts).filter((arg) => arg !== '--silent');
    return lintApp(app, [...forwarded, ...passthrough]);
  },
  async start() {
    return startApp();
  },
  async 'full-build'() {
    return buildAll();
  },
  async 'full-test'() {
    return testAll();
  },
  async 'full-lint'({ passthrough, opts }) {
    const forwarded = collectToolsArgs(opts).filter((arg) => arg !== '--silent');
    return lintAll([...forwarded, ...passthrough]);
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
    const base = passthrough.length ? passthrough : filter ? ['--filter', filter] : [];
    const forwarded = collectToolsArgs(opts).filter((arg) => arg !== '--silent');
    return buildCI([...base, ...forwarded]);
  },
  async testCI({ passthrough, filter, opts }) {
    const base = passthrough.length ? passthrough : filter ? ['--filter', filter] : [];
    const forwarded = collectToolsArgs(opts).filter((arg) => arg !== '--silent');
    return testCI([...base, ...forwarded]);
  },
  async perfBudgets({ passthrough, opts }) {
    const forwarded = collectToolsArgs(opts, true).filter((arg) => arg !== '--silent');
    return runPerfBudgets([...forwarded, ...passthrough]);
  },
  async publish({ opts }) {
    const forwarded = collectToolsArgs(opts).filter((arg) => arg !== '--silent');
    return publishPackage(forwarded);
  },
  async release({ opts }) {
    // Keep the standard argument collector
    const forwarded = collectToolsArgs(opts);

    // Normalize special short flags used by the release script
    // Converts "--d" → "-d" and "--s" → "-s" (only those cases)
    const normalized = forwarded
      .filter((arg) => arg !== '--silent')
      .map((arg) => {
        if (arg === '--d') return '-d';
        if (arg === '--s') return '-s';
        return arg;
      });

    return createRelease(normalized);
  },
  async cli() {
    // Everything after "cli" is forwarded directly to manager-cli
    const cliIndex = process.argv.indexOf('cli');
    let extraArgs = cliIndex !== -1 ? process.argv.slice(cliIndex + 1) : [];

    // Strip --silent before passing to manager-cli
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
 * CLI entrypoint. Parses args, selects action, executes it, and handles errors.
 * @returns {Promise<void>}
 */
async function main() {
  const { opts, passthrough } = parseArgs(process.argv.slice(2));

  if (process.argv.includes('--silent')) {
    setLoggerMode('silent');
  } else {
    setLoggerMode('stderr'); // safe default for jq pipes
  }

  const { action, type = 'pnpm', app = null, filter = null, region = 'EU', mode = null } = opts;
  const container = Boolean(opts.container);

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

  logger.info(`manager-pm v${VERSION}
type: ${type}
action: ${action}
app: ${app || '(none)'}
filter: ${filter || '(none)'}
region: ${region}
container: ${container}
mode: ${mode || '(none)'}`);

  try {
    const handler = actions[action];
    if (!handler) {
      logger.warn(`⚠️  Unknown action: "${action}"`);
      printHelp();
      process.exit(1);
    }

    await handler({ app, passthrough, filter, mode, opts });
    process.exit(0);
  } catch (err) {
    logger.error(err.stack || err.message || err);
    process.exit(1);
  }
}

// ---- Run CLI ----
main();
