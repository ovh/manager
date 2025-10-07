#!/usr/bin/env node
import { execSync } from 'node:child_process';
import path from 'node:path';

import { EMOJIS, MUK_COMPONENTS_PATH, TARGET_PACKAGES } from '../config/muk-config.js';
import { getOutdatedPackages } from '../core/npm-utils.js';
import { loadJson, writeJson } from '../utils/json-utils.js';
import { logger } from '../utils/log-manager.js';

/**
 * Run `yarn install` in the manager root folder.
 */
export function runYarnInstall() {
  const rootDir = path.resolve('.'); // root of the monorepo

  try {
    logger.info('🔧 Running yarn install from project root...');
    execSync('yarn install', {
      stdio: 'inherit',
      cwd: rootDir,
    });
    logger.success('✅ Yarn install completed successfully.');
  } catch (err) {
    logger.error(`❌ Yarn install failed: ${err.message}`);
  }
}

/**
 * Update ODS versions in muk-components package.json,
 * and optionally run `yarn install` afterwards.
 */
export async function updateOdsVersions({ withInstall = false } = {}) {
  const pkgPath = path.join(MUK_COMPONENTS_PATH, 'package.json');
  const pkgJson = await loadJson(pkgPath);

  const updates = await getOutdatedPackages(pkgJson, TARGET_PACKAGES);

  if (updates.length === 0) {
    logger.success('✅ All ODS versions are already up to date!');
    return;
  }

  for (const { name, latest } of updates) {
    if (pkgJson.devDependencies?.[name]) {
      pkgJson.devDependencies[name] = `^${latest}`;
    }
    if (pkgJson.peerDependencies?.[name]) {
      pkgJson.peerDependencies[name] = `^${latest}`;
    }
  }

  await writeJson(pkgPath, pkgJson);

  logger.success(`${EMOJIS.check} Updated ${updates.length} ODS dependencies:`);
  updates.forEach(({ name, local, latest }) => logger.info(`${name}: ${local} → ${latest}`));

  logger.info(`📦 package.json successfully updated at: ${pkgPath}`);

  if (withInstall) {
    runYarnInstall();
  }
}
