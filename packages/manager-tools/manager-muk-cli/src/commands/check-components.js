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
 * Extract remote ODS React component names (including subcomponents).
 *
 * Handles nested structures such as:
 *   src/components/accordion/src/components/accordion-item/
 *
 * Produces normalized names like:
 *   accordion, accordion-item, accordion-trigger
 *
 * @returns {Promise<string[]>} - Sorted list of normalized ODS component names.
 */
export async function getRemoteOdsComponents() {
  const { version, tarball } = await getOdsPackageMetadata();
  logger.info(`${EMOJIS.package} Fetching ODS React v${version} tarball: ${tarball}`);

  const files = await extractOdsTarball();
  const components = new Set();

  for (const filePath of files.keys()) {
    // 🔹 Identify the root component name
    const rootMatch = filePath.match(/src\/components\/([^/]+)\//);
    if (!rootMatch) continue;
    const root = rootMatch[1];

    // 🔹 Detect subcomponent paths (e.g., src/components/accordion/src/components/accordion-item)
    const subMatch = filePath.match(new RegExp(`src/components/${root}/src/components/([^/]+)/`));

    if (subMatch) {
      let sub = subMatch[1];

      // Normalize redundant prefixes (e.g., accordion-accordion-item → accordion-item)
      if (sub.startsWith(`${root}-`)) {
        sub = sub.slice(root.length + 1);
      }

      // Skip self-subcomponents (e.g., divider-divider)
      if (sub === root) continue;

      components.add(`${root}-${sub}`);
    } else {
      components.add(root);
    }
  }

  const componentList = [...components].filter(Boolean).sort();

  logger.info(
    `${EMOJIS.check} Extracted ${componentList.length} ODS components (normalized structure)`,
  );
  return componentList;
}

/**
 * Compare the component sets between local MUK and remote ODS React sources.
 *
 * @param {object} [options]
 * @param {boolean} [options.returnOnly=false] - If true, skip summary logging and only return data.
 * @returns {Promise<{ missingComponents: string[], extraLocalComponents: string[] }>}
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
