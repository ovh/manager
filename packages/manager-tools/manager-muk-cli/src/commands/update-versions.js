#!/usr/bin/env node
import path from 'node:path';

import { EMOJIS, MUK_COMPONENTS_PATH, TARGET_PACKAGES } from '../config/muk-config.js';
import { getOutdatedPackages } from '../core/npm-utils.js';
import { runPostUpdateChecks } from '../core/tasks-utils.js';
import { loadJson, writeJson } from '../utils/json-utils.js';
import { logger } from '../utils/log-manager.js';

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
