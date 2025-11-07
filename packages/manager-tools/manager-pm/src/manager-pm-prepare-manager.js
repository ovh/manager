#!/usr/bin/env node
/**
 * CLI tool to prepare manager.
 *
 * Handles graceful shutdown (SIGINT, SIGTERM, unhandled errors)
 * and ensures root workspaces are restored if the process is interrupted.
 */
import process from 'node:process';
import { promises as fs } from 'node:fs';
import { logger } from './kernel/utils/log-manager.js';
import { attachCleanupSignals, handleProcessAbortSignals } from './kernel/utils/process-utils.js';
import { rootPackageJsonPath } from './playbook/playbook-config.js';
import { runYarnInstall } from './kernel/utils/tasks-utils.js';
import { clearRootWorkspaces } from './kernel/utils/catalog-utils.js';

attachCleanupSignals(handleProcessAbortSignals);

async function main() {
  logger.info('🚀 manager-pm pm:prepare:manager CLI started...');
  const start = Date.now();

  try {
    const raw = await fs.readFile(rootPackageJsonPath, 'utf-8');
    const pkg = JSON.parse(raw);

    if (!pkg.workspaces || typeof pkg.workspaces !== 'object') {
      logger.warn('⚠️ Root package.json had no valid workspaces field. Creating a new one.');
      pkg.workspaces = { packages: ["packages/manager-tools/manager-pm"] };
    } else {
      pkg.workspaces.packages = ["packages/manager-tools/manager-pm"];
    }

    await fs.writeFile(rootPackageJsonPath, JSON.stringify(pkg, null, 2));

    runYarnInstall(['--ignore-scripts']);

    await clearRootWorkspaces();

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
