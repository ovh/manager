#!/usr/bin/env node
/**
 * CLI tool to remove legacy workspace.
 *
 * Handles graceful shutdown (SIGINT, SIGTERM, unhandled errors)
 * and ensures root workspaces are restored if the process is interrupted.
 */
import process from 'node:process';

import { logger } from './kernel/utils/log-manager.js';
import { attachCleanupSignals, handleProcessAbortSignals } from './kernel/utils/process-utils.js';
import { clearRootWorkspaces } from './kernel/utils/workspace-utils.js';

attachCleanupSignals(handleProcessAbortSignals);

async function main() {
  logger.info('🚀 manager-pm pm:remove:legacy:workspace CLI started...');
  const start = Date.now();

  try {
    await clearRootWorkspaces();
    const elapsed = ((Date.now() - start) / 1000).toFixed(2);
    logger.success(`✅ manager-pm pm:remove:legacy:workspace completed in ${elapsed}s`);
  } catch (err) {
    logger.error('❌ manager-pm pm:remove:legacy:workspace failed:');
    logger.error(err.stack || err.message || err);
    await handleProcessAbortSignals('pm:remove:legacy:workspace-error', err);
    process.exit(1);
  }
}

await main();
