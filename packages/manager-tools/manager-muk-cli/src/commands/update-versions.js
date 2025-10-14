#!/usr/bin/env node
import path from 'node:path';

import { EMOJIS, MUK_COMPONENTS_PATH, TARGET_PACKAGES } from '../config/muk-config.js';
import { getOutdatedPackages } from '../core/npm-utils.js';
import { runPostUpdateChecks } from '../core/tasks-utils.js';
import { loadJson, writeJson } from '../utils/json-utils.js';
import { logger } from '../utils/log-manager.js';

/**
 * 🚀 Update ODS package versions in `manager-react-components/package.json`
 * only if a newer version exists on npm (never downgrade or overwrite newer local versions).
 *
 * ### Process Overview
 * 1. Load the local `package.json` for `manager-react-components`.
 * 2. Retrieve latest npm versions for {@link TARGET_PACKAGES}.
 * 3. Use {@link getOutdatedPackages} (semver-aware) to compare versions.
 * 4. Update only packages where `status === 'outdated'`.
 * 5. Save the updated `package.json` and run post-update checks.
 *
 * @async
 * @function updateOdsVersions
 * @returns {Promise<void>} Resolves when update and validation complete.
 *
 * @example
 * ```bash
 * yarn muk-cli --update-version
 * ```
 */
export async function updateOdsVersions() {
  const pkgPath = path.join(MUK_COMPONENTS_PATH, 'package.json');
  const pkgJson = await loadJson(pkgPath);

  // getOutdatedPackages now returns [{ name, local, latest, status }]
  const allComparisons = await getOutdatedPackages(pkgJson, TARGET_PACKAGES);

  // Only consider packages that are strictly outdated
  const updates = allComparisons.filter((pkg) => pkg.status === 'outdated');

  if (updates.length === 0) {
    logger.success(`${EMOJIS.success} All ODS versions are already up to date or ahead of npm!`);
    return;
  }

  // Apply updates only for outdated packages
  for (const { name, local, latest } of updates) {
    if (pkgJson.devDependencies?.[name]) {
      pkgJson.devDependencies[name] = `^${latest}`;
    }
    if (pkgJson.peerDependencies?.[name]) {
      pkgJson.peerDependencies[name] = `^${latest}`;
    }
    logger.info(`${EMOJIS.info} ${name}: ${local} → ${latest}`);
  }

  // Persist updated package.json
  await writeJson(pkgPath, pkgJson);
  logger.success(`${EMOJIS.check} Updated ${updates.length} ODS dependencies in package.json`);
  logger.info(`📦 Saved to: ${pkgPath}`);

  // Run post-update validation (install + lint + test)
  runPostUpdateChecks();
}
