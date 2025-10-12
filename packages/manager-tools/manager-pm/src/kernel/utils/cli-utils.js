import process from 'node:process';

import { logger } from './log-manager.js';

/** Parse `--app <val>`, `-a <val>`, or `--app=<val>` from argv. */
export function parseAppArg(argv = process.argv.slice(2)) {
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--app' || a === '-a') return argv[i + 1];
    if (a?.startsWith?.('--app=')) return a.slice('--app='.length);
  }
  return undefined;
}

/** Print usage lines and exit(1). */
export function usageAndExit(usageLines = []) {
  for (const line of usageLines) logger.info(line);
  process.exit(1);
}

/**
 * Run an app-scoped action with consistent timing/logging and exit codes.
 * @param {Object} opts
 * @param {string} opts.actionLabel - used in logs (e.g., "add-app")
 * @param {Function} opts.handler - async (appRef) => void
 * @param {string[]} opts.usage - lines to print when --app is missing
 * @param {string} [opts.successEmoji="✅"]
 */
export async function runAppCli({ actionLabel, handler, usage, successEmoji = '✅' }) {
  const appRef = parseAppArg();
  if (!appRef) {
    logger.error(`❌ Missing required --app <name|package|path>.`);
    usageAndExit(usage);
    return; // unreachable
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
