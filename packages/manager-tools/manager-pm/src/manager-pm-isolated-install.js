#!/usr/bin/env node
/**
 * CLI tool to prepare manager.
 *
 * Handles graceful shutdown (SIGINT, SIGTERM, unhandled errors)
 * and ensures root workspaces are restored if the process is interrupted.
 */
import process from 'node:process';

import { logger } from './kernel/utils/log-manager.js';
import { attachCleanupSignals, handleProcessAbortSignals } from './kernel/utils/process-utils.js';
import { runIsolatedModulesInstall } from './kernel/utils/tasks-utils.js';

attachCleanupSignals(handleProcessAbortSignals);

async function main() {
  logger.info('🚀 manager-pm pm:prepare:manager CLI started...');
  const start = Date.now();

  try {
    await runIsolatedModulesInstall(['packages/manager-tools/manager-pm']);

    const elapsed = ((Date.now() - start) / 1000).toFixed(2);
    logger.success(`✅ manager-pm pm:prepare:manager completed in ${elapsed}s`);
  } catch (err) {
    logger.error('❌ manager-pm pm:prepare:manager failed:');
    logger.error(err.stack || err.message || err);
    await handleProcessAbortSignals('pm:prepare:manager-error', err);
    process.exit(1);
  }
}

await main();
