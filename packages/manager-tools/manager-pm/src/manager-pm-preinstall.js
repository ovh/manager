#!/usr/bin/env node
/**
 * Pre-installation script for manager-pm.
 *
 * This script runs as a Yarn `preinstall` hook to prepare the monorepo
 * for hybrid Yarn + PNPM workflows. It delegates to the internal
 * {@link yarnPreInstall} process and logs timing, success, and errors
 * with clear output.
 *
 * Responsibilities:
 * - Restricts root `workspaces.packages` to Yarn-only apps.
 * - Ensures clean setup before Yarn runs dependency installation.
 * - Provides consistent logs and error handling.
 *
 * @module manager-pm/preinstall
 */
import process from 'node:process';

import { yarnPreInstall } from './kernel/pnpm/pnpm-deps-manager.js';
import { logger } from './kernel/utils/log-manager.js';

/**
 * Main entrypoint for the pre-installation routine.
 *
 * Workflow:
 *  1. Logs the start of the preinstall process with timing.
 *  2. Executes {@link yarnPreInstall} to adjust root workspaces.
 *  3. Logs completion time and success.
 *  4. On failure, prints a detailed error stack and exits with code 1.
 *
 * @async
 * @function main
 * @returns {Promise<void>} Resolves when the pre-installation completes successfully.
 * @throws Exits the process with status `1` on error.
 *
 * @example
 * // Invoked automatically by Yarn as a preinstall hook
 * await main();
 */
async function main() {
  logger.info('🚀 manager-pm preinstall hook started...');

  const start = Date.now();
  try {
    await yarnPreInstall();
    const elapsed = ((Date.now() - start) / 1000).toFixed(2);
    logger.success(`✅ manager-pm preinstall completed in ${elapsed}s`);
  } catch (err) {
    logger.error('❌ manager-pm preinstall failed:');
    logger.error(err.stack || err.message || err);
    process.exit(1);
  }
}

await main();
