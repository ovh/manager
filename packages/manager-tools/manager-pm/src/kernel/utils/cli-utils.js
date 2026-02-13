import process from 'node:process';

import { logger } from './log-manager.js';
import { isTurboRunner, normalizeTurboCiArgs } from './turbo-utils.js';

/**
 * @typedef {{
 *   opts: Record<string, string|boolean>,
 *   rest: string[],
 *   passthrough: string[]
 * }} ParsedArgs
 */

/**
 * Print usage information and terminate the process with exit code 1.
 * @param {string[]} usageLines - The usage lines to display.
 */
function printUsageAndExit(usageLines = []) {
  for (const line of usageLines) {
    logger.info(line);
  }
  process.exit(1);
}

/** Parse `--app <val>`, `-a <val>`, or `--app=<val>` from argv. */
function parseAppArg(argv = process.argv.slice(2)) {
  for (let i = 0; i < argv.length; i += 1) {
    const appArg = argv[i];
    if (appArg === '--app' || appArg === '-a') return argv[i + 1];
    if (appArg?.startsWith?.('--app=')) return appArg.slice('--app='.length);
  }
  return undefined;
}

/**
 * Run an app-scoped action with consistent timing/logging and exit codes.
 * @param {Object} opts
 * @param {string} opts.actionLabel - used in logs (e.g., "add-app")
 * @param {Function} opts.handler - async (appRef) => void
 * @param {string[]} opts.usage - lines to print when --app is missing
 * @param {string} [opts.successEmoji="✅"]
 */
export async function runApplicationCli({ actionLabel, handler, usage, successEmoji = '✅' }) {
  const appRef = parseAppArg();

  if (!appRef) {
    logger.error(`❌ Missing required --app <name|package|path>.`);
    printUsageAndExit(usage);
    return;
  }

  logger.debug(`[${actionLabel}] appRef="${appRef}"`);

  const start = Date.now();
  try {
    await handler(appRef);
    const elapsed = ((Date.now() - start) / 1000).toFixed(2);
    logger.success(`${successEmoji} manager-pm ${actionLabel} completed in ${elapsed}s`);
    process.exit(0);
  } catch (err) {
    logger.error(`❌ manager-pm ${actionLabel} failed:`);
    logger.error(err?.stack || err?.message || String(err));
    process.exit(1);
  }
}

/**
 * Parse `--module <value>`, `-m <value>`, or `--module=<value>` from the command-line arguments.
 * @param {string[]} argv - The process arguments to parse. Defaults to `process.argv.slice(2)`.
 * @returns {string|undefined} The parsed module reference, or `undefined` if not provided.
 */
function parseModuleArgument(argv = process.argv.slice(2)) {
  for (let i = 0; i < argv.length; i += 1) {
    const currentArg = argv[i];
    if (currentArg === '--module' || currentArg === '-m') return argv[i + 1];
    if (currentArg?.startsWith?.('--module=')) {
      return currentArg.slice('--module='.length);
    }
  }
  return undefined;
}

/**
 * Execute a module-scoped CLI command with consistent logging, error handling, and timing.
 *
 * @param {Object} options
 * @param {string} options.actionLabel - Descriptive label for the CLI action (e.g., "add-module" or "remove-module").
 * @param {Function} options.handler - Async function to execute, receiving `moduleReference` as argument.
 * @param {string[]} options.usageLines - Lines to display when `--module` is missing.
 * @param {string} [options.successEmoji='✅'] - Emoji shown when the action completes successfully.
 */
export async function runModuleCli({ actionLabel, handler, usageLines, successEmoji = '✅' }) {
  const moduleReference = parseModuleArgument();

  // Detect --private flag
  const isPrivate = process.argv.includes('--private') || process.argv.includes('-p');

  if (!moduleReference) {
    logger.error('❌ Missing required --module <package|path>.');
    printUsageAndExit(usageLines);
    return;
  }

  logger.debug(`[${actionLabel}] moduleReference="${moduleReference}", isPrivate=${isPrivate}`);

  const startTimestamp = Date.now();

  try {
    await handler(moduleReference, { isPrivate });

    const durationSeconds = ((Date.now() - startTimestamp) / 1000).toFixed(2);
    logger.success(`${successEmoji} manager-pm ${actionLabel} completed in ${durationSeconds}s`);

    process.exit(0);
  } catch (error) {
    logger.error(`❌ manager-pm ${actionLabel} failed:`);
    logger.error(error?.stack || error?.message || String(error));
    process.exit(1);
  }
}

/**
 * Split argv into:
 * - args: everything before `--`
 * - passthrough: everything after `--`
 *
 * @param {string[]} argv
 * @returns {{ args: string[], passthrough: string[] }}
 */
function splitPassthrough(argv) {
  const dashdashIndex = argv.indexOf('--');
  if (dashdashIndex === -1) {
    return { args: argv, passthrough: [] };
  }

  return {
    args: argv.slice(0, dashdashIndex),
    passthrough: argv.slice(dashdashIndex + 1),
  };
}

/**
 * Read a value from the next arg if it looks like a value (not another flag).
 *
 * @param {string[]} args
 * @param {number} index
 * @returns {string|null}
 */
function readNextValue(args, index) {
  const next = args[index + 1];
  if (typeof next !== 'string' || next.length === 0) return null;
  if (next.startsWith('-')) return null;
  return next;
}

/**
 * Parse "key=value" form.
 *
 * @param {string} input
 * @returns {{ key: string, value: string } | null}
 */
function parseKeyValue(input) {
  const eqIndex = input.indexOf('=');
  if (eqIndex === -1) return null;

  const key = input.slice(0, eqIndex);
  const value = input.slice(eqIndex + 1); // keep empty string if provided: "--foo="
  if (!key) return null;

  return { key, value };
}

/**
 * Set an option value into opts.
 *
 * @param {Record<string, string|boolean>} opts
 * @param {string} key
 * @param {string|boolean} value
 */
function setOpt(opts, key, value) {
  opts[key] = value;
}

/**
 * Handle long flags: --key, --key value, --key=value
 *
 * @param {string[]} args
 * @param {number} index
 * @param {Record<string, string|boolean>} opts
 * @returns {number} New index (can advance if value consumed)
 */
function handleLongFlag(args, index, opts) {
  const raw = args[index].slice(2);

  const kv = parseKeyValue(raw);
  if (kv) {
    setOpt(opts, kv.key, kv.value);
    return index;
  }

  const key = raw;
  const nextValue = readNextValue(args, index);

  if (nextValue !== null) {
    setOpt(opts, key, nextValue);
    return index + 1; // consumed next
  }

  setOpt(opts, key, true);
  return index;
}

/**
 * Handle short flags:
 * - -abc           => a=true, b=true, c=true
 * - -x value       => x=value
 * - -x=value       => x=value
 * - -x             => x=true
 *
 * @param {string[]} args
 * @param {number} index
 * @param {Record<string, string|boolean>} opts
 * @returns {number} New index (can advance if value consumed)
 */
function handleShortFlag(args, index, opts) {
  const raw = args[index].slice(1);

  const kv = parseKeyValue(raw);
  if (kv) {
    setOpt(opts, kv.key, kv.value);
    return index;
  }

  // bundle: -abc
  if (raw.length > 1) {
    raw.split('').forEach((letter) => setOpt(opts, letter, true));
    return index;
  }

  // single: -x [value]
  const key = raw;
  const nextValue = readNextValue(args, index);

  if (nextValue !== null) {
    setOpt(opts, key, nextValue);
    return index + 1; // consumed next
  }

  setOpt(opts, key, true);
  return index;
}

/**
 * Parse CLI arguments into:
 *  - opts: key/value flags (supports --foo bar, --foo=bar, -x y, -x=y, -abc)
 *  - rest: positional arguments
 *  - passthrough: everything after `--`
 *
 * @param {string[]} argv - Command-line arguments (excluding node + script).
 * @returns {ParsedArgs}
 */
export function parseCLIArgs(argv) {
  /** @type {Record<string, string|boolean>} */
  const opts = {};
  /** @type {string[]} */
  const rest = [];

  const { args, passthrough } = splitPassthrough(argv);

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg.startsWith('--')) {
      i = handleLongFlag(args, i, opts);
      continue;
    }

    if (arg.startsWith('-') && arg.length > 1) {
      i = handleShortFlag(args, i, opts);
      continue;
    }

    rest.push(arg);
  }

  return { opts, rest, passthrough };
}

/**
 * Build CI args once, then normalize them depending on the resolved runner.
 *
 * - Nx runner: keep raw args (Nx already has its own normalization).
 * - Turbo runner: apply Turbo normalization (avoid Nx-only flags crashing Turbo).
 * - Custom runner: keep raw args (don’t mutate unknown CLIs).
 *
 * @param {{
 *   passthrough: string[],
 *   filter?: string|null,
 *   opts: Record<string, string|boolean>,
 *   runner: string,
 *   resolveBaseArgs: (p: { passthrough?: string[], filter?: string|null }) => string[],
 *   collectForwardedArgs: (o: Record<string, string|boolean>) => string[],
 *   isNxRunner: (r: string) => boolean
 * }} params
 * @returns {string[]}
 */
export function resolveCiArgsToRun({
  passthrough,
  filter,
  opts,
  runner,
  resolveBaseArgs,
  collectForwardedArgs,
  isNxRunner,
}) {
  const baseArgs = resolveBaseArgs({ passthrough, filter });
  const forwardedArgs = collectForwardedArgs(opts);

  const rawArgs = [...baseArgs, ...forwardedArgs];

  if (isNxRunner(runner)) return rawArgs;
  if (isTurboRunner(runner)) return normalizeTurboCiArgs(rawArgs);

  // Custom runner: don’t guess, don’t rewrite
  return rawArgs;
}
