import process from 'node:process';

import { logger } from './log-manager.js';

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
