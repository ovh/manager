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

import { yarnPostInstall } from './kernel/pnpm/pnpm-deps-manager.js';
import { logger } from './kernel/utils/log-manager.js';

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
  logger.info('🚀 manager-pm postinstall hook started...');

  const start = Date.now();
  try {
    await yarnPostInstall();
    const elapsed = ((Date.now() - start) / 1000).toFixed(2);
    logger.success(`✅ manager-pm postinstall completed successfully in ${elapsed}s`);
  } catch (err) {
    logger.error('❌ manager-pm postinstall failed:');
    logger.error(err.stack || err.message || err);
    process.exit(1);
  }
}

await main();
