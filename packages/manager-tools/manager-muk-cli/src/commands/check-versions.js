#!/usr/bin/env node
import path from 'node:path';

import { MUK_COMPONENTS_PATH, TARGET_PACKAGES } from '../config/muk-config.js';
import { getOutdatedPackages } from '../core/npm-utils.js';
import { loadJson } from '../utils/json-utils.js';
import { logger } from '../utils/log-manager.js';

/**
 * Compare local and remote versions for ODS packages.
 */
export async function checkVersions() {
  const pkgPath = path.join(MUK_COMPONENTS_PATH, 'package.json');
  const localPkg = await loadJson(pkgPath);

  const results = await getOutdatedPackages(localPkg, TARGET_PACKAGES);

  if (results.length === 0) {
    logger.success('✅ All ODS packages are up to date!');
  } else {
    logger.warn('⚠ Updates available:');
    for (const { name, local, latest } of results) {
      logger.info(`${name}: ${local} → ${latest}`);
    }
  }

  return results;
}
