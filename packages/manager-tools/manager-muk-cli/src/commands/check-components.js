#!/usr/bin/env node
import { promises as fs } from 'node:fs';

import { EMOJIS, MUK_COMPONENTS_SRC } from '../config/muk-config.js';
import { extractOdsTarball, getOdsPackageMetadata } from '../core/ods-tarball-utils.js';
import { logger } from '../utils/log-manager.js';

/**
 * Get list of local manager-ui-kit (MUK) components.
 * @returns {Promise<string[]>}
 */
async function getLocalComponents() {
  const entries = await fs.readdir(MUK_COMPONENTS_SRC, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);
  logger.info(`${EMOJIS.folder} Found ${dirs.length} local components`);
  return dirs;
}

/**
 * Extract remote component folder names from ODS React npm tarball.
 * @returns {Promise<string[]>} Sorted list of component names.
 */
async function getRemoteOdsComponents() {
  const { version, tarball } = await getOdsPackageMetadata();
  logger.info(`${EMOJIS.package} Fetching ODS React v${version} tarball: ${tarball}`);

  // Extract all files (broad, unfiltered)
  const files = await extractOdsTarball();

  logger.debug(`📦 Extracted ${files.size} files from tarball (showing first 10):`);
  logger.debug([...files.keys()].slice(0, 10));

  // Derive component names based on directory structure
  const components = new Set();
  for (const filePath of files.keys()) {
    const match = filePath.match(/src\/components\/([^/]+)\//);
    if (match) components.add(match[1]);
  }

  const list = [...components].filter(Boolean).sort();
  logger.info(`${EMOJIS.check} Extracted ${list.length} components from ODS tarball`);
  return list;
}

/**
 * Compare local and remote ODS React component lists.
 *
 * @param {object} [options]
 * @param {boolean} [options.returnOnly=false] - If true, return data without printing summary logs.
 * @returns {Promise<{ missingComponents: string[], extraLocalComponents: string[] }>}
 */
export async function checkComponents({ returnOnly = false } = {}) {
  logger.info(`${EMOJIS.info} Checking component parity between ODS React and Manager UI Kit...`);

  const [localComponents, remoteComponents] = await Promise.all([
    getLocalComponents(),
    getRemoteOdsComponents(),
  ]);

  const missingComponents = remoteComponents.filter((remote) => !localComponents.includes(remote));
  const extraLocalComponents = localComponents.filter((local) => !remoteComponents.includes(local));

  if (returnOnly) {
    return { missingComponents, extraLocalComponents };
  }

  logger.info(
    `ℹ Remote count: ${remoteComponents.length}, Local count: ${localComponents.length}`,
  );

  if (missingComponents.length === 0) {
    logger.success('✅ All ODS components exist locally.');
  } else {
    logger.warn(`⚠ Missing ${missingComponents.length} ODS components:`);
    missingComponents.forEach((c) => logger.info(`• ${c}`));
  }

  if (extraLocalComponents.length > 0) {
    logger.debug(
      `Local-only components (${extraLocalComponents.length}): ${extraLocalComponents.join(', ')}`,
    );
  }

  return { missingComponents, extraLocalComponents };
}
