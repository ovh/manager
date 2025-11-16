#!/usr/bin/env node
/**
 * CLI tool to add a module to the PNPM catalog safely.
 *
 * Handles graceful shutdown (SIGINT, SIGTERM, unhandled errors)
 * and ensures root workspaces are restored if the process is interrupted.
 */
import process from 'node:process';

import { addModuleToPnpm } from './kernel/pnpm/pnpm-modules-manager.js';
import { runModuleCli } from './kernel/utils/cli-utils.js';
import { logger } from './kernel/utils/log-manager.js';
import { attachCleanupSignals, handleProcessAbortSignals } from './kernel/utils/process-utils.js';

attachCleanupSignals(handleProcessAbortSignals);

async function main() {
  logger.info('🚀 manager-pm add-module CLI started...');
  const start = Date.now();

  try {
    await runModuleCli({
      actionLabel: 'add-module',
      handler: addModuleToPnpm,
      usage: [
        'Usage: yarn pm:add:module --module <package|path> [--private]',
        'Examples:',
        '  yarn pm:add:module --module packages/manager/core/api',
        '  yarn pm:add:module --module @ovh-ux/manager-core-api',
        '  yarn pm:add:module --module packages/manager/core/application --private',
        '  yarn pm:add:module --module @ovh-ux/manager-core-utils --private',
      ],
    });

    const elapsed = ((Date.now() - start) / 1000).toFixed(2);
    logger.success(`✅ manager-pm add-module completed in ${elapsed}s`);
  } catch (err) {
    logger.error('❌ manager-pm add-module failed:');
    logger.error(err.stack || err.message || err);
    await handleProcessAbortSignals('add-module-error', err);
    process.exit(1);
  }
}

await main();
