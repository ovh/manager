#!/usr/bin/env node
/**
 * Post-installation script for manager-pm.
 *
 * This script invokes the `yarnPostInstall` process to handle dependency setup
 * and logs errors gracefully if the process fails. It ensures that the program
 * exits with a non-zero status code on failure.
 *
 * @module manager-pm/postinstall
 */
import process from 'node:process';

import { buildCI } from './kernel/helpers/tasks-helper.js';
import { yarnPostInstall } from './kernel/pnpm/pnpm-deps-manager.js';
import { isEnvOptionEnabled } from './kernel/utils/env-utils.js';
import { logger } from './kernel/utils/log-manager.js';
import { attachCleanupSignals, handleProcessAbortSignals } from './kernel/utils/process-utils.js';
import { clearRootWorkspaces } from './kernel/utils/workspace-utils.js';

attachCleanupSignals(handleProcessAbortSignals);

/**
 * Main entrypoint for the post-installation routine.
 *
 * - Executes `yarnPostInstall` to handle dependency linking or setup.
 * - Logs structured messages for visibility at start, success, and failure.
 * - Prints execution time to help diagnose slow installs.
 * - Exits the process with code `1` on failure.
 *
 * @async
 * @function main
 * @returns {Promise<void>} Resolves when the post-installation completes successfully.
 */
async function main() {
  if (isEnvOptionEnabled(process.env.SKIP_POST_INSTALL)) {
    logger.info('⏭️  SKIP_POST_INSTALL is set — skipping manager-pm postinstall.');
    await clearRootWorkspaces();
    return;
  }

  logger.info('🚀 manager-pm postinstall hook started...');

  const start = Date.now();
  try {
    await yarnPostInstall();
    await buildCI(['--filter=@ovh-ux/muk']);
    const elapsed = ((Date.now() - start) / 1000).toFixed(2);
    logger.success(`✅ manager-pm postinstall completed successfully in ${elapsed}s`);
  } catch (err) {
    logger.error('❌ manager-pm postinstall failed:');
    logger.error(err.stack || err.message || err);
    await handleProcessAbortSignals('postinstall-error', err);
    process.exit(1);
  }
}

await main();
