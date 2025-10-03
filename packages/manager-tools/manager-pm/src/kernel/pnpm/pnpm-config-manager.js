import { promises as fs } from 'node:fs';
import { existsSync } from 'node:fs';
import path from 'node:path';

import { writeJson } from '../utils/json-utils.js';
import { logger } from '../utils/log-manager.js';

/**
 * Try to locate a Vitest config file in a given app directory.
 *
 * Supported filenames: vitest.config.ts, vitest.config.js, vitest.config.mjs
 *
 * @param {string} appPath - Path to the app workspace.
 * @returns {string|null} Path to vitest config file if found, otherwise null.
 */
export function findVitestConfig(appPath) {
  for (const name of ['vitest.config.ts', 'vitest.config.js', 'vitest.config.mjs']) {
    const candidate = path.join(appPath, name);
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

/**
 * Ensure @ovh-ux/manager-tests-setup is present in devDependencies.
 *
 * @param {string} appPath - Path to the app workspace.
 * @returns {Promise<void>}
 */
async function ensureManagerTestsSetupDevDep(appPath) {
  const pkgPath = path.join(appPath, 'package.json');
  try {
    const raw = await fs.readFile(pkgPath, 'utf8');
    const pkg = JSON.parse(raw);
    if (!pkg.devDependencies) pkg.devDependencies = {};
    if (!pkg.devDependencies['@ovh-ux/manager-tests-setup']) {
      pkg.devDependencies['@ovh-ux/manager-tests-setup'] = 'latest';
      await writeJson(pkgPath, pkg);
      logger.success(`➕ Added @ovh-ux/manager-tests-setup to devDependencies in ${pkgPath}`);
      logger.debug(`SECURITY: app was missing shared test setup, auto-pinned to latest.`);
    }
  } catch (err) {
    logger.warn(`⚠️ Could not update devDependencies in ${pkgPath}: ${err.message}`);
    logger.debug(`SECURITY: devDependencies update skipped, manual verification required.`);
  }
}

/**
 * Ensure the Vitest config has the correct import for defaultDedupedDependencies.
 *
 * @param {string} code - The original Vitest config source code.
 * @param {string} configPath - Path to the config file (for logs).
 * @param {string} appPath - Path to the application (for devDep injection).
 * @returns {Promise<{ code: string, modified: boolean }>}
 */
async function ensureImports(code, configPath, appPath) {
  let modified = false;

  if (code.includes('@ovh-ux/manager-tests-setup')) {
    if (!code.includes('defaultDedupedDependencies')) {
      code = code.replace(/createConfig/, 'createConfig, \r\tdefaultDedupedDependencies');
      logger.success(
        `➕ Injected defaultDedupedDependencies into existing import in ${configPath}`,
      );
      modified = true;
    } else {
      logger.debug(`✔ Import already includes defaultDedupedDependencies in ${configPath}`);
    }
  } else {
    code = `import { defaultDedupedDependencies } from '@ovh-ux/manager-tests-setup';\n${code}`;
    logger.success(`➕ Added fresh import for defaultDedupedDependencies in ${configPath}`);
    modified = true;
    await ensureManagerTestsSetupDevDep(appPath);
  }

  return { code, modified };
}

/**
 * Ensure the Vitest config has a resolve.dedupe block with defaultDedupedDependencies.
 *
 * @param {string} code - The original Vitest config source code.
 * @param {string} configPath - Path to the config file (for logs).
 * @returns {{ code: string, modified: boolean }}
 */
function ensureResolveDedupe(code, configPath) {
  let modified = false;

  if (code.includes('resolve:')) {
    if (code.includes('dedupe:')) {
      if (!code.includes('...defaultDedupedDependencies')) {
        code = code.replace(/dedupe:\s*\[/, `dedupe: [\n        ...defaultDedupedDependencies,`);
        logger.success(`➕ Spread defaultDedupedDependencies into dedupe[] in ${configPath}`);
        modified = true;
      } else {
        logger.debug(`✔ dedupe[] already contains defaultDedupedDependencies in ${configPath}`);
      }
    } else {
      code = code.replace(
        /resolve:\s*{([^}]*)}/,
        (m, g) => `resolve: { dedupe: [...defaultDedupedDependencies], ${g}}`,
      );
      logger.success(`➕ Added dedupe[] inside resolve in ${configPath}`);
      modified = true;
    }
  } else {
    code = code.replace(
      /export default/,
      `export default {\n  resolve: { dedupe: [...defaultDedupedDependencies] },`,
    );
    logger.success(`➕ Added new resolve with dedupe[] into ${configPath}`);
    modified = true;
  }

  return { code, modified };
}

/**
 * Patch an application's Vitest configuration to ensure deduplication of React
 * and critical shared dependencies.
 *
 * This function is idempotent: repeated runs will not duplicate imports or dedupe entries.
 *
 * @param {string} appPath - Path to the application being migrated.
 * @returns {Promise<void>}
 */
export async function patchVitestConfig(appPath) {
  const configPath = findVitestConfig(appPath);
  if (!configPath) {
    logger.info(`ℹ️ No vitest.config.* found in ${appPath}, skipping patch`);
    return;
  }

  logger.debug(`🔎 Inspecting Vitest config at ${configPath}`);
  let code = await fs.readFile(configPath, 'utf8');
  let modified = false;

  // Step 1 — Imports
  const importsResult = await ensureImports(code, configPath, appPath);
  code = importsResult.code;
  modified ||= importsResult.modified;

  // Step 2 — Resolve.dedupe
  const resolveResult = ensureResolveDedupe(code, configPath);
  code = resolveResult.code;
  modified ||= resolveResult.modified;

  if (modified) {
    await fs.writeFile(configPath, code, 'utf8');
    logger.success(`✔ Patched Vitest config at ${configPath}`);
  } else {
    logger.info(`ℹ️ No changes required in ${configPath}`);
  }
}
