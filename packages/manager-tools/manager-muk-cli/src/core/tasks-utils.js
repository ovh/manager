import { execSync } from 'node:child_process';
import path from 'node:path';

import { MUK_COMPONENTS_PATH } from '../config/muk-config.js';
import { logger } from '../utils/log-manager.js';

/**
 * Run a command safely with logging.
 * @param {string} cmd - Command to execute.
 * @param {string} cwd - Working directory.
 * @param {string} desc - Human-readable description.
 */
function runCommand(cmd, cwd, desc) {
  try {
    logger.info(`🔧 Running ${desc}...`);
    execSync(cmd, { stdio: 'inherit', cwd });
    logger.success(`✅ ${desc} completed successfully.`);
  } catch (err) {
    logger.error(`❌ ${desc} failed: ${err.message}`);
  }
}

/**
 * Run post-update validation tasks in `manager-react-components`.
 *
 * This function executes three sequential steps:
 * 1. Installs dependencies from the **monorepo root** using `yarn install`.
 * 2. Runs the modern lint command (`yarn lint:modern`) inside the `manager-react-components` package.
 * 3. Runs unit tests (`yarn test`) inside the same package.
 *
 * Each command is executed through {@link runCommand}, which handles logging, error capture, and I/O output.
 *
 * @example
 * ```bash
 * yarn muk-cli --update-version
 * ```
 *
 * @remarks
 * - This function does **not** throw if one of the commands fails — it logs errors instead.
 * - Intended for use after dependency updates to detect regressions (lint/test failures).
 *
 * @returns {void}
 */
export function runPostUpdateChecks() {
  const componentDir = MUK_COMPONENTS_PATH;
  const rootDir = path.resolve('.');

  runCommand('yarn install', rootDir, 'yarn install from project root');
  runCommand('yarn lint:modern:fix', componentDir, 'Lint (modern)');
  runCommand('yarn test', componentDir, 'Unit tests');
}
