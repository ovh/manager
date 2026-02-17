import { promises as fs } from 'node:fs';
import os from 'node:os';

import { rootPackageJsonPath, toolsPlaybookPath } from '../../playbook/playbook-config.js';
import { loadToolsCatalog } from './catalog-utils.js';
import { isCI } from './env-utils.js';
import { logger } from './log-manager.js';

/**
 * @typedef {Object} ToolCatalogEntry
 * @property {string} version
 *   The npm version to inject into root `package.json`.
 *   Example: `"22.3.3"`.
 *
 * @property {string[]} supportedOs
 *   A list of Node.js supported platforms (from {@link os.platform})
 *   allowed for local developer machines.
 *   Example: `["win32", "darwin"]`.
 *
 * @property {string[]} ciSupportedOs
 *   A list of Node.js supported platforms allowed in CI environments.
 *   Example: `["linux"]`.
 */

/**
 * @typedef {Record<string, ToolCatalogEntry>} ToolsCatalog
 * Mapping of tool name → tool metadata and constraints.
 *
 * Example:
 * ```json
 * {
 *   "nx": {
 *     "version": "22.3.3",
 *     "supportedOs": ["win32", "darwin"],
 *     "ciSupportedOs": ["linux"]
 *   }
 * }
 * ```
 */

/**
 * Determine whether a tool should be injected into `package.json`
 * based on the current OS and runtime environment (CI vs local).
 *
 * Rules:
 * - On developer machines (non-CI), the OS must match `supportedOs`.
 * - On CI, the OS must match `ciSupportedOs`.
 *
 * @param {ToolCatalogEntry} toolSpec - Tool catalog entry metadata.
 * @returns {boolean} `true` if the tool should be injected; otherwise `false`.
 */
export function isToolAllowed(toolSpec) {
  const currentOs = os.platform(); // win32 | darwin | linux
  const allowed = isCI ? toolSpec.ciSupportedOs : toolSpec.supportedOs;

  logger.debug(
    `[tools] isToolAllowed(): env=${isCI ? 'CI' : 'local'} os=${currentOs} allowed=${JSON.stringify(allowed)}`,
  );

  if (!Array.isArray(allowed) || allowed.length === 0) {
    logger.warn(
      `[tools] Tool skipped: missing ${isCI ? '"ciSupportedOs"' : '"supportedOs"'} constraints in catalog`,
    );
    return false;
  }

  const isAllowed = allowed.includes(currentOs);

  if (!isAllowed) {
    logger.info(`[tools] Tool skipped: OS "${currentOs}" is not supported for this environment`);
  }

  return isAllowed;
}

/**
 * Inject supported tools from the tools catalog into the root `package.json`.
 *
 * Behavior:
 * - Loads the tools catalog JSON from {@link toolsPlaybookPath}.
 * - Injects tools into `devDependencies` as:
 *   `"toolName": "toolSpec.version"`
 * - OS-aware (skips tools not supported on the current platform).
 * - Environment-aware (local uses `supportedOs`, CI uses `ciSupportedOs`).
 * - Idempotent (does not rewrite if version is already correct).
 *
 * @async
 * @function injectTools
 * @returns {Promise<number>} The number of tools injected or updated.
 */
export async function injectTools() {
  logger.info('🧰 [tools] Injecting supported tools into root package.json...');
  logger.debug(`[tools] toolsPlaybookPath=${toolsPlaybookPath}`);

  // Load root package.json
  const raw = await fs.readFile(rootPackageJsonPath, 'utf-8');
  const pkg = JSON.parse(raw);
  pkg.devDependencies ??= {};

  // Load tools catalog JSON
  const toolsCatalog = await loadToolsCatalog();
  logger.info(`📖 [tools] Loaded tools catalog (${Object.keys(toolsCatalog).length} tool(s))`);

  let injectedCount = 0;

  for (const [toolName, toolSpec] of Object.entries(toolsCatalog ?? {})) {
    const version = toolSpec?.version;

    if (!version) {
      logger.warn(`⚠️ [tools] ${toolName} skipped (missing "version")`);
      continue;
    }

    if (!isToolAllowed(toolSpec)) {
      logger.info(`⏭️ [tools] ${toolName}@${version} skipped (unsupported OS)`);
      continue;
    }

    // Idempotent injection
    if (pkg.devDependencies[toolName] === version) {
      logger.info(`✔ [tools] already present: ${toolName}@${version}`);
      continue;
    }

    pkg.devDependencies[toolName] = version;
    injectedCount++;
    logger.success(`✅ [tools] injected ${toolName}@${version}`);
  }

  if (injectedCount > 0) {
    await fs.writeFile(rootPackageJsonPath, JSON.stringify(pkg, null, 2));
    logger.success(`🎯 [tools] Injection done (${injectedCount} tool(s) injected).`);
  } else {
    logger.info('ℹ️ [tools] Nothing to inject.');
  }

  return injectedCount;
}
