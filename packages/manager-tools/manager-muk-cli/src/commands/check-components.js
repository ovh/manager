#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';

import { EMOJIS, MUK_COMPONENTS_SRC } from '../config/muk-config.js';
import { toKebabCase } from '../core/file-utils.js';
import {
  extractOdsComponentsTarball,
  getOdsComponentsPackageMetadata,
} from '../core/ods-components-tarball-utils.js';
import { logger } from '../utils/log-manager.js';

/**
 * Recursively retrieve all local Manager UI Kit (MUK) components,
 * including subcomponents (e.g., form-field-label, modal-body).
 * Normalizes redundant prefixes like `modal-modal-body` → `modal-body`.
 */
async function getLocalComponents(baseDir = MUK_COMPONENTS_SRC, parent = '') {
  const entries = await fs.readdir(baseDir, { withFileTypes: true });
  const components = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const folder = entry.name;
    const fullPath = path.join(baseDir, folder);

    // Build the compound name
    let compoundName = parent ? `${parent}-${folder}` : folder;

    // 🧠 Normalize redundant prefixes: "modal-modal-body" → "modal-body"
    if (parent && compoundName.startsWith(`${parent}-${parent}-`)) {
      compoundName = compoundName.replace(`${parent}-${parent}-`, `${parent}-`);
    }

    // Also handle direct duplication: "form-field-form-field-label" → "form-field-label"
    const doublePrefixRegex = new RegExp(`^(${parent})-\\1-`);
    if (doublePrefixRegex.test(compoundName)) {
      compoundName = compoundName.replace(doublePrefixRegex, `$1-`);
    }

    components.push(compoundName);

    // Recurse into potential subcomponents
    const subEntries = await fs.readdir(fullPath, { withFileTypes: true });
    const hasNested = subEntries.some((sub) => sub.isDirectory() && sub.name !== '__tests__');
    if (hasNested) {
      const subComponents = await getLocalComponents(fullPath, compoundName);
      components.push(...subComponents);
    }
  }

  if (!parent) {
    logger.info(
      `${EMOJIS.folder} Found ${components.length} local components (recursive, normalized)`,
    );
  }

  return components;
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
  const { version, tarball } = await getOdsComponentsPackageMetadata();
  logger.info(`${EMOJIS.package} Fetching ODS React v${version} tarball: ${tarball}`);

  const files = await extractOdsComponentsTarball();
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
      logger.warn(`${EMOJIS.warn} Skipping ${filePath} (not found in tarball)`);
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

  const normalizedLocal = localComponents.map(toKebabCase);
  const normalizedRemote = remoteComponents.map(toKebabCase);

  const missingComponents = normalizedRemote.filter((remote) => {
    // If exact match exists, OK
    if (normalizedLocal.includes(remote)) return false;

    // Otherwise, check if parent folder exists locally
    const parent = remote.split('-')[0]; // e.g. tabs-tab → tabs
    return !normalizedLocal.includes(parent);
  });

  const extraLocalComponents = normalizedLocal.filter((local) => !normalizedRemote.includes(local));

  if (returnOnly) return { missingComponents, extraLocalComponents };

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
