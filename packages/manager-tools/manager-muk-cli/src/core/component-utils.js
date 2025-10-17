import { EMOJIS } from '../config/muk-config.js';
import { logger } from '../utils/log-manager.js';
import { detectHasChildrenFromTarball } from './ods-components-tarball-utils.js';

/**
 * Dynamically groups ODS components based on their naming structure.
 *
 * Example:
 * ```
 * ['button', 'form-field', 'form-field-error', 'form-field-helper']
 *   → { 'button': [], 'form-field': ['form-field-error', 'form-field-helper'] }
 * ```
 *
 * The algorithm:
 * 1. Splits each kebab-case component name into parts.
 * 2. For single-part names, marks them as standalone.
 * 3. For multi-part names, progressively checks whether intermediate
 *    prefixes (e.g., `form-field`) represent actual component families
 *    that have subcomponents in the tarball.
 * 4. Logs a summary of detected parent-child relationships.
 *
 * Why:
 * - Some ODS components (like `form-field-error`) are logically children
 *   of a higher-level component (`form-field`). Grouping these helps
 *   generate structured documentation and avoid duplication.
 *
 * @async
 * @param {string[]} components - All ODS component names in kebab-case.
 * @returns {Promise<Record<string, string[]>>} - Map of `{ parent → [children] }`.
 */
export async function groupComponentsDynamically(components) {
  const grouped = {};

  for (const name of components) {
    const parts = name.split('-');

    // Single-part components (like "range") are always standalone
    if (parts.length === 1) {
      if (!grouped[name]) grouped[name] = [];
      continue;
    }

    // Multi-part components — progressively detect if any prefix is a parent
    let parent = parts[0];
    let candidate = parts[0];

    for (let i = 1; i < parts.length; i++) {
      candidate = `${candidate}-${parts[i]}`;
      const hasChildren = await detectHasChildrenFromTarball(candidate);

      if (hasChildren) parent = candidate;
    }

    // Fallback: treat as flat component if no hierarchy detected
    if (!grouped[parent]) grouped[parent] = [];
    if (parent !== name) grouped[parent].push(name);
  }

  // Log grouping summary for debugging and visibility
  const summary = Object.entries(grouped)
    .map(([p, c]) => `${p} → ${c.length ? c.join(', ') : '(no children)'}`)
    .join('\n');
  logger.info(`${EMOJIS.package} Dynamic grouping summary:\n${summary}`);

  return grouped;
}
