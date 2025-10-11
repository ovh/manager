import { execSync } from 'node:child_process';

import { logger } from '../utils/log-manager.js';

/**
 * Run a command safely with logging.
 * @param {string} cmd - Command to execute.
 * @param {string} cwd - Working directory.
 * @param {string} desc - Human-readable description.
 */
export function runCommand(cmd, cwd, desc) {
  try {
    logger.info(`🔧 Running ${desc}...`);
    execSync(cmd, { stdio: 'inherit', cwd });
    logger.success(`✅ ${desc} completed successfully.`);
  } catch (err) {
    logger.error(`❌ ${desc} failed: ${err.message}`);
  }
}
