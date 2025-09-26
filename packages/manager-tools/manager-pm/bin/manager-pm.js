#!/usr/bin/env node
/**
 * @fileoverview manager-pm CLI entrypoint.
 *
 * Provides a simple argument parser and dispatcher for actions like
 * build, test, lint, CI tasks, docs, and manager-cli passthrough.
 * Supports forwarding arbitrary Turbo CLI flags.
 */
import process from 'node:process';

import {
  clearRootWorkspaces,
  updateRootWorkspacesFromCatalogs,
} from '../src/kernel/commons/catalog-utils.js';
import { logger } from '../src/kernel/commons/log-manager.js';
import { startApp } from '../src/kernel/pnpm/pnpm-start-app.js';
import {
  buildAll,
  buildApp,
  buildCI,
  buildDocs,
  lintAll,
  lintApp,
  runManagerCli,
  testAll,
  testApp,
  testCI,
} from '../src/kernel/pnpm/pnpm-tasks-manager.js';

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
 * Print usage instructions for manager-pm.
 * @returns {void}
 */
function printHelp() {
  logger.info(`
Usage: manager-pm --type pnpm --action <action> [options]

Single-app mode:
  build   --app <name>      Build one app only
  test    --app <name>      Run tests for one app only
  lint    --app <name>      Run lint for one app only

Turbo passthrough:
  buildCI [--filter <expr>] [other turbo options]
  testCI  [--filter <expr>] [other turbo options]

Global:
  full-build   Build ALL apps
  full-test    Run tests across ALL apps
  full-lint    Run lint across ALL apps
  start        Launch interactive app starter
  docs         Build documentation workspace
  cli          Run manager-cli with passthrough args
  workspace    Manage root workspaces (prepare/remove)

Examples:
  manager-pm --type pnpm --action build --app web
  manager-pm --type pnpm --action cli -- migrations-status --type all
  manager-pm --action workspace --mode prepare
  manager-pm --action workspace --mode remove
`);
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
 * Collect extra CLI options to forward to Turbo.
 *
 * @param {Record<string, string|boolean>} opts - Parsed CLI options.
 * @returns {string[]} Array of CLI flags for Turbo.
 */
function collectTurboArgs(opts) {
  const excluded = ['action', 'type', 'app', 'filter', 'region', 'mode', 'container'];
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
  async lint({ app }) {
    if (!app) exitError(`Action "lint" requires --app`);
    return lintApp(app);
  },
  async buildCI({ passthrough, filter, opts }) {
    const base = passthrough.length ? passthrough : filter ? ['--filter', filter] : [];
    const forwarded = collectTurboArgs(opts);
    return buildCI([...base, ...forwarded]);
  },
  async testCI({ passthrough, filter, opts }) {
    const base = passthrough.length ? passthrough : filter ? ['--filter', filter] : [];
    const forwarded = collectTurboArgs(opts);
    return testCI([...base, ...forwarded]);
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
  async 'full-lint'() {
    return lintAll();
  },
  async docs() {
    return buildDocs();
  },
  async cli() {
    // Everything after "cli" is forwarded directly to manager-cli
    const cliIndex = process.argv.indexOf('cli');
    const extraArgs = cliIndex !== -1 ? process.argv.slice(cliIndex + 1) : [];
    return runManagerCli(extraArgs);
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
};

/**
 * CLI entrypoint. Parses args, selects action, executes it, and handles errors.
 * @returns {Promise<void>}
 */
async function main() {
  const { opts, passthrough } = parseArgs(process.argv.slice(2));
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
    if (!handler) exitError(`❌ Unknown action: "${action}"`);
    await handler({ app, passthrough, filter, mode, opts });
    process.exit(0);
  } catch (err) {
    logger.error(err.stack || err.message || err);
    process.exit(1);
  }
}

// ---- Run CLI ----
main();
