#!/usr/bin/env node
import path from 'node:path';

import { EMOJIS, MUK_COMPONENTS_PATH, TARGET_PACKAGES } from '../config/muk-config.js';
import { getOutdatedPackages } from '../core/npm-utils.js';
import { loadJson } from '../utils/json-utils.js';
import { logger } from '../utils/log-manager.js';

/**
 * Compare local and remote ODS package versions.
 *
 * Uses semantic versioning to detect:
 * - ⚠️ Outdated packages (local < npm)
 * - 🚀 Ahead-of-latest packages (local > npm)
 * - ℹ️ Non-standard or pre-release versions
 *
 * Logs a readable summary to the console and returns structured results.
 *
 * @returns {Promise<Array<{name: string, local: string, latest: string, status: 'outdated' | 'ahead' | 'equal' | 'unknown'}>>}
 *
 * @example
 * const results = await checkVersions();
 * // Logs:
 * // ⚠ Outdated packages:
 * //   @ovh-ux/ods-core: 19.3.0 → 19.4.0
 * //
 * // 🚀 Locally ahead of npm:
 * //   @ovh-ux/ods-ui-kit: local 19.5.0-rc.1 > npm 19.4.0
 */
export async function checkVersions() {
  const pkgPath = path.join(MUK_COMPONENTS_PATH, 'package.json');
  const localPkg = await loadJson(pkgPath);

  const results = await getOutdatedPackages(localPkg, TARGET_PACKAGES);

  if (results.length === 0) {
    logger.success(`${EMOJIS.success} All ODS packages are up to date!`);
    return [];
  }

  const outdated = results.filter((r) => r.status === 'outdated');
  const ahead = results.filter((r) => r.status === 'ahead');
  const unknown = results.filter((r) => r.status === 'unknown');

  if (outdated.length > 0) {
    logger.warn(`\n${EMOJIS.warn} Outdated packages:`);
    for (const { name, local, latest } of outdated) {
      logger.info(`  ${name}: ${local} → ${latest}`);
    }
  }

  if (ahead.length > 0) {
    logger.info(`\n${EMOJIS.rocket} Locally ahead of npm:`);
    for (const { name, local, latest } of ahead) {
      logger.info(`  ${name}: local ${local} > npm ${latest}`);
    }
  }

  if (unknown.length > 0) {
    logger.info(`\n${EMOJIS.info} Non-standard or pre-release versions:`);
    for (const { name, local, latest } of unknown) {
      logger.info(`  ${name}: local ${local} vs npm ${latest}`);
    }
  }

  if (outdated.length === 0 && ahead.length === 0 && unknown.length === 0) {
    logger.success(`${EMOJIS.success} All ODS packages are up to date!`);
  }

  return results;
}
