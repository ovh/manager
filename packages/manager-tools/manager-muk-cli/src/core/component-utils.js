import { logger } from '../utils/log-manager.js';
import { detectHasChildrenFromTarball } from './ods-tarball-utils.js';

/**
 * Groups ODS components dynamically based on naming and source analysis.
 * - Simple components (combobox, datepicker, range) → flat grouping
 * - Nested families (form-field-error, form-field-helper) → dynamic detection
 *
 * @param {string[]} components - All ODS component names (kebab-case)
 * @returns {Promise<Record<string, string[]>>} - Mapping of { parent → [children] }
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

    // Try dynamic detection only for multi-part names
    let parent = parts[0];
    let candidate = parts[0];

    for (let i = 1; i < parts.length; i++) {
      candidate = `${candidate}-${parts[i]}`;
      const hasChildren = await detectHasChildrenFromTarball(candidate);

      if (hasChildren) {
        parent = candidate;
      }
    }

    // fallback to flat grouping if parent not found
    if (!grouped[parent]) grouped[parent] = [];

    if (parent !== name) grouped[parent].push(name);
  }

  // Log grouping summary
  const summary = Object.entries(grouped)
    .map(([p, c]) => `${p} → ${c.length ? c.join(', ') : '(no children)'}`)
    .join('\n');

  logger.info(`📦 Dynamic grouping summary:\n${summary}`);

  return grouped;
}
