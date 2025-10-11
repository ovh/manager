#!/usr/bin/env node
import { promises as fs } from 'node:fs';

import { EMOJIS, MUK_COMPONENTS_SRC } from '../config/muk-config.js';
import { extractOdsTarball, getOdsPackageMetadata } from '../core/ods-tarball-utils.js';
import { logger } from '../utils/log-manager.js';

/**
 * Retrieve all local Manager UI Kit (MUK) components.
 *
 * @returns {Promise<string[]>} - A list of local component folder names.
 */
async function getLocalComponents() {
  const entries = await fs.readdir(MUK_COMPONENTS_SRC, { withFileTypes: true });
  const componentDirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

  logger.info(`${EMOJIS.folder} Found ${componentDirs.length} local components`);
  return componentDirs;
}

/**
 * Extract exported ODS React components by analyzing index.ts files.
 * Only considers exports from `./components/...`, excluding contexts, constants, and utils.
 *
 * Handles:
 * - Multi-line exports
 * - Type exports
 * - Redundant prefixes (e.g., combobox-combobox-item)
 * - Root component fallback
 */
export async function getRemoteOdsComponents() {
  const { version, tarball } = await getOdsPackageMetadata();
  logger.info(`${EMOJIS.package} Fetching ODS React v${version} tarball: ${tarball}`);

  const files = await extractOdsTarball();
  const components = new Set();

  // Locate index.ts files under src/components/<name>/src/index.ts
  const indexFiles = [...files.keys()].filter((p) =>
    /src\/components\/[^/]+\/src\/index\.ts$/.test(p),
  );

  for (const filePath of indexFiles) {
    const rootMatch = filePath.match(/src\/components\/([^/]+)\/src\/index\.ts$/);
    if (!rootMatch) continue;
    const root = rootMatch[1];

    const fileBuffer = files.get(filePath);
    if (!fileBuffer) {
      logger.warn(`${EMOJIS.warning} Skipping ${filePath} (not found in tarball)`);
      continue;
    }

    const content = fileBuffer.toString('utf8');

    // Match multi-line export blocks from components folder only
    const exportBlocks = content.matchAll(
      /export\s*\{[\s\S]*?\}\s*from\s*['"]\.\/components\/([^/'"]+)\/?/g,
    );

    for (const match of exportBlocks) {
      let sub = match[1].trim();

      if (sub.startsWith(`${root}-`)) sub = sub.slice(root.length + 1);
      if (sub === root) continue;

      components.add(`${root}-${sub}`);
    }

    components.add(root);
  }

  const componentList = [...components].sort();
  logger.info(
    `${EMOJIS.check} Extracted ${componentList.length} exported ODS components (public API only).`,
  );

  return componentList;
}

/**
 * Compare the component sets between local MUK and remote ODS React sources.
 *
 * @param {object} [options]
 * @param {boolean} [options.returnOnly=false] - If true, skip summary logging and only return data.
 * @returns {Promise<{missingComponents: T[], extraLocalComponents: T[]}>}
 */
export async function checkComponents({ returnOnly = false } = {}) {
  logger.info(`${EMOJIS.info} Comparing component parity between ODS React and Manager UI Kit...`);

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
    `ℹ ODS Components: ${remoteComponents.length}, Local Components: ${localComponents.length}`,
  );

  if (missingComponents.length === 0) {
    logger.success(`${EMOJIS.check} All ODS components exist locally.`);
  } else {
    logger.warn(`⚠ Missing ${missingComponents.length} ODS components:`);
    missingComponents.forEach((name) => logger.info(`• ${name}`));
  }

  if (extraLocalComponents.length > 0) {
    logger.debug(
      `${EMOJIS.folder} Local-only components (${extraLocalComponents.length}): ${extraLocalComponents.join(', ')}`,
    );
  }

  return { missingComponents, extraLocalComponents };
}
