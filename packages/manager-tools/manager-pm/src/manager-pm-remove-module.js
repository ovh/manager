#!/usr/bin/env node
/**
 * CLI tool to remove an module from the PNPM catalog safely.
 *
 * Handles graceful shutdown (SIGINT, SIGTERM, unhandled errors)
 * and ensures root workspaces are restored if the process is interrupted.
 */
import process from 'node:process';

import { logger } from './kernel/utils/log-manager.js';
import { attachCleanupSignals, handleProcessAbortSignals } from './kernel/utils/process-utils.js';

attachCleanupSignals(handleProcessAbortSignals);

async function main() {
  logger.info('🚀 manager-pm remove-module CLI started...');
  const start = Date.now();

  try {
    // todo

    const elapsed = ((Date.now() - start) / 1000).toFixed(2);
    logger.success(`✅ manager-pm remove-module completed in ${elapsed}s`);
  } catch (err) {
    logger.error('❌ manager-pm remove-module failed:');
    logger.error(err.stack || err.message || err);
    await handleProcessAbortSignals('remove-module-error', err);
    process.exit(1);
  }
}

await main();
