#!/usr/bin/env node
/**
 * CLI tool to remove an app from the PNPM catalog safely.
 *
 * Handles graceful shutdown (SIGINT, SIGTERM, unhandled errors)
 * and ensures root workspaces are restored if the process is interrupted.
 */
import process from 'node:process';

import { removeAppFromPnpm } from './kernel/pnpm/pnpm-apps-manager.js';
import { runAppCli } from './kernel/utils/cli-utils.js';
import { logger } from './kernel/utils/log-manager.js';
import { attachCleanupSignals, handleProcessAbortSignals } from './kernel/utils/process-utils.js';

attachCleanupSignals(handleProcessAbortSignals);

async function main() {
  logger.info('🚀 manager-pm remove-app CLI started...');
  const start = Date.now();

  try {
    await runAppCli({
      actionLabel: 'remove-app',
      handler: removeAppFromPnpm,
      usage: [
        'Usage: yarn pm:remove:app --app <name|package|path>',
        'Examples:',
        '  yarn pm:remove:app --app web',
        '  yarn pm:remove:app --app packages/manager/apps/web',
        '  yarn pm:remove:app --app @ovh-ux/manager-web',
      ],
    });

    const elapsed = ((Date.now() - start) / 1000).toFixed(2);
    logger.success(`✅ manager-pm remove-app completed in ${elapsed}s`);
  } catch (err) {
    logger.error('❌ manager-pm remove-app failed:');
    logger.error(err.stack || err.message || err);
    await handleProcessAbortSignals('remove-app-error', err);
    process.exit(1);
  }
}

await main();
