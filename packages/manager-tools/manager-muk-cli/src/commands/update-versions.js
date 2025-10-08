#!/usr/bin/env node
import path from 'node:path';

import { EMOJIS, MUK_COMPONENTS_PATH, TARGET_PACKAGES } from '../config/muk-config.js';
import { getOutdatedPackages } from '../core/npm-utils.js';
import { runCommand } from '../core/tasks-utils.js';
import { loadJson, writeJson } from '../utils/json-utils.js';
import { logger } from '../utils/log-manager.js';

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
function runPostUpdateChecks() {
  const componentDir = MUK_COMPONENTS_PATH;
  const rootDir = path.resolve('.');

  runCommand('yarn install', rootDir, 'yarn install from project root');
  runCommand('yarn lint:modern', componentDir, 'Lint (modern)');
  runCommand('yarn test', componentDir, 'Unit tests');
}

/**
 * Update ODS package versions in `manager-react-components/package.json`,
 * then execute linting and testing checks to detect regressions.
 *
 * ### Process overview:
 * 1. Load the local `package.json` for `manager-react-components`.
 * 2. Retrieve the latest npm versions for all ODS-related packages listed in {@link TARGET_PACKAGES}.
 * 3. Compare local and remote versions using {@link getOutdatedPackages}.
 * 4. If updates exist, bump both `devDependencies` and `peerDependencies` accordingly.
 * 5. Persist the modified `package.json` atomically using {@link writeJson}.
 * 6. Run {@link runPostUpdateChecks} to validate code integrity (install + lint + test).
 *
 * @async
 * @function updateOdsVersions
 * @returns {Promise<void>} Resolves when update and post-validation are complete.
 *
 * @example
 * ```bash
 * yarn muk-cli --update-version
 * ```
 * Produces:
 * ```
 * ✔ Updated 3 ODS dependencies:
 * ℹ @ovhcloud/ods-react: 19.0.1 → 19.1.0
 * 📦 package.json successfully updated at: ./packages/manager-react-components/package.json
 * 🔧 Running yarn install from project root...
 * ✅ Yarn install completed successfully.
 * 🔧 Running Lint (modern)...
 * ✅ Lint (modern) completed successfully.
 * 🔧 Running Unit tests...
 * ✅ Unit tests completed successfully.
 * ```
 *
 * @throws {Error} Propagates errors from {@link loadJson} or {@link writeJson} if file operations fail.
 */
export async function updateOdsVersions() {
  const pkgPath = path.join(MUK_COMPONENTS_PATH, 'package.json');
  const pkgJson = await loadJson(pkgPath);

  const updates = await getOutdatedPackages(pkgJson, TARGET_PACKAGES);

  if (updates.length === 0) {
    logger.success('✅ All ODS versions are already up to date!');
    return;
  }

  // Update dependency versions where applicable
  for (const { name, latest } of updates) {
    if (pkgJson.devDependencies?.[name]) {
      pkgJson.devDependencies[name] = `^${latest}`;
    }
    if (pkgJson.peerDependencies?.[name]) {
      pkgJson.peerDependencies[name] = `^${latest}`;
    }
  }

  // Persist updated package.json
  await writeJson(pkgPath, pkgJson);

  logger.success(`${EMOJIS.check} Updated ${updates.length} ODS dependencies:`);
  updates.forEach(({ name, local, latest }) => logger.info(`${name}: ${local} → ${latest}`));

  logger.info(`📦 package.json successfully updated at: ${pkgPath}`);

  // Run validation tasks
  runPostUpdateChecks();
}
