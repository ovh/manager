import process from 'node:process';
import { setImmediate } from 'node:timers';
import { setTimeout } from 'node:timers/promises';

import { logger } from './log-manager.js';
import { clearRootWorkspaces } from './workspace-utils.js';

/**
 * Registers process-level listeners for graceful shutdown.
 * Guarantees async cleanup finishes before exiting.
 *
 * @param {(reason: string, err?: Error) => Promise<void>|void} onAbort
 */
export function attachCleanupSignals(onAbort) {
  const signals = ['SIGINT', 'SIGTERM'];
  let isCleaning = false;

  async function cleanupOnce(reason, err) {
    if (isCleaning) return;
    isCleaning = true;

    // Prevent Node from terminating immediately on Ctrl+C
    if (process.stdin.isTTY) process.stdin.pause();

    try {
      await onAbort(reason, err);
    } catch (cleanupErr) {
      logger.error(`❌ Cleanup failed after ${reason}: ${cleanupErr.message}`);
    } finally {
      // Give any pending logs time to flush
      await new Promise((r) => setImmediate(r));
      process.exit(reason === 'exit' ? 0 : 1);
    }
  }

  for (const signal of signals) {
    process.once(signal, () => cleanupOnce(signal));
  }

  process.once('uncaughtException', (err) => cleanupOnce('uncaughtException', err));
  process.once('unhandledRejection', (err) => cleanupOnce('unhandledRejection', err));
}

/**
 * Cleanup handler for abnormal termination.
 * Ensures root workspaces are restored and logs reason.
 *
 * @param {string} reason - Exit reason (signal or error type)
 * @param {Error|unknown} [err] - Optional error object
 */
export async function handleProcessAbortSignals(reason, err) {
  if (err) {
    logger.error(`❌ Aborted due to ${reason}: ${err.message || err}`);
    logger.debug(err.stack || '');
  } else {
    logger.warn(`⚠️ Aborted due to ${reason}`);
  }

  try {
    await clearRootWorkspaces();
    logger.info('🧹 Root workspaces restored to original state.');
  } catch (cleanupErr) {
    logger.error(`❌ Cleanup failed: ${cleanupErr.message}`);
  }

  // Wait briefly to ensure logs flush before exit
  await setTimeout(100);
  process.exit(1);
}
