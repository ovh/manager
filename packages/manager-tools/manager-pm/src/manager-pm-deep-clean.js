#!/usr/bin/env node
/**
 * @file cleanup-deep.js
 * @description
 * Fast cross-platform cleanup script using shelljs.
 * Deletes common build artifacts like node_modules, dist, .turbo, and target.
 * Gracefully handles missing dependencies — assumes node_modules were cleaned.
 */
import { createRequire } from 'node:module';
import process from 'node:process';

import { logger } from './kernel/utils/log-manager.js';

const require = createRequire(import.meta.url);
let shell;

/**
 * Attempt to load shelljs gracefully.
 */
try {
  shell = require('shelljs');
} catch {
  logger.warn(
    [
      '⚠️  It looks like node_modules were already removed during a previous cleanup.',
      '',
      '👉 Please reinstall dependencies:',
      '   yarn install',
      '',
      'Then re-run your command if needed:',
      '   yarn clean:deep',
      '',
    ].join('\n'),
  );
  process.exit(0);
}

const REPO_ROOT = process.cwd();
const ARTIFACT_DIR_NAMES = ['node_modules', 'dist', '.turbo', 'target'];

/**
 * Runs a fast deep cleanup across the repository.
 *
 * @param {string} [rootDir=process.cwd()] - The directory to start cleaning from.
 */
export function runDeepCleanup(rootDir = REPO_ROOT) {
  logger.info('🧽 Starting deep cleanup...');

  for (const targetName of ARTIFACT_DIR_NAMES) {
    const found = shell
      .find(rootDir)
      .filter((p) => p.endsWith(`/${targetName}`) || p.endsWith(`\\${targetName}`));

    if (found.length === 0) {
      logger.debug(`No '${targetName}' directories found.`);
      continue;
    }

    const sample = found
      .slice(0, 3)
      .map((p) => `   • ${p}`)
      .join('\n');
    const suffix =
      found.length > 3 ? `\n${sample}\n   ...and ${found.length - 3} more.` : `\n${sample}`;
    logger.info(`🧹 Removing ${found.length} '${targetName}' directories...${suffix}`);

    shell.rm('-rf', found);
  }

  logger.info('✅ Deep cleanup complete!');
}

// Execute immediately when run directly
runDeepCleanup();
