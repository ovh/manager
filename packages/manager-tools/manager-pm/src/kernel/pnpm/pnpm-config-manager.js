import { promises as fs } from 'node:fs';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { logger } from '../commons/log-manager.js';
import { writeJson } from '../commons/json-utils.js';

/**
 * Try to locate a Vitest config file in a given app directory.
 *
 * Supported filenames: vitest.config.ts, vitest.config.js, vitest.config.mjs
 *
 * @param {string} appPath - Path to the app workspace.
 * @returns {string|null} Path to vitest config file if found, otherwise null.
 */
function findVitestConfig(appPath) {
  for (const name of ['vitest.config.ts', 'vitest.config.js', 'vitest.config.mjs']) {
    const candidate = path.join(appPath, name);
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

/**
 * Patch an application's Vitest configuration to ensure deduplication of React
 * and critical shared dependencies. This avoids runtime/test regressions caused
 * by duplicate React instances or mismatched module versions.
 *
 * Strategy:
 *   1. Ensure an import for `defaultDedupedDependencies` exists.
 *      - If '@ovh-ux/manager-tests-setup' is already imported without it,
 *        add it deterministically alongside `createConfig`.
 *      - If already imported with it, no changes.
 *      - If no import at all, inject a new one and update devDependencies.
 *
 *   2. Ensure `resolve.dedupe` includes `...defaultDedupedDependencies`.
 *      - If `resolve` + `dedupe` exist but no spread → insert spread.
 *      - If `resolve` exists without `dedupe` → add `dedupe: [...defaultDedupedDependencies]`.
 *      - If no `resolve` at all → create a new resolve block.
 *
 * This function is idempotent: repeated runs will not duplicate imports or dedupe entries.
 *
 * Security/trace logs are emitted for each mutation.
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

  //
  // STEP 1 — Imports
  //
  if (code.includes('@ovh-ux/manager-tests-setup')) {
    if (!code.includes('defaultDedupedDependencies')) {
      code = code.replace(/createConfig/, 'createConfig, \r\tdefaultDedupedDependencies');
      logger.success(`➕ Injected defaultDedupedDependencies into existing import in ${configPath}`);
      logger.debug(`SECURITY: ensured dedupe baseline present in shared import (manager-tests-setup).`);
      modified = true;
    } else {
      logger.debug(`✔ Import already includes defaultDedupedDependencies in ${configPath}`);
    }
  } else {
    // Add new import at top
    code = `import { defaultDedupedDependencies } from '@ovh-ux/manager-tests-setup';\n${code}`;
    logger.success(`➕ Added fresh import for defaultDedupedDependencies in ${configPath}`);
    logger.debug(`SECURITY: enforced shared dedupe list import for consistency.`);

    modified = true;

    // Ensure devDep exists
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

  //
  // STEP 2 — Resolve.dedupe
  //
  if (code.includes('resolve:')) {
    if (code.includes('dedupe:')) {
      if (!code.includes('...defaultDedupedDependencies')) {
        code = code.replace(/dedupe:\s*\[/, `dedupe: [
        ...defaultDedupedDependencies,`);
        logger.success(`➕ Spread defaultDedupedDependencies into dedupe[] in ${configPath}`);
        logger.debug(`SECURITY: ensured dedupe baseline prevents multiple React copies.`);
        modified = true;
      } else {
        logger.debug(`✔ dedupe[] already contains defaultDedupedDependencies in ${configPath}`);
      }
    } else {
      // Add dedupe into resolve
      code = code.replace(
        /resolve:\s*{([^}]*)}/,
        (m, g) => `resolve: {
      dedupe: [...defaultDedupedDependencies], ${g}}`
      );
      logger.success(`➕ Added dedupe[] with defaultDedupedDependencies inside resolve in ${configPath}`);
      logger.debug(`SECURITY: injected dedupe list into existing resolve block.`);
      modified = true;
    }
  } else {
    // Append resolve block
    code = code.replace(
      /export default/,
      `export default {\n  resolve: { dedupe: [...defaultDedupedDependencies] },`
    );
    logger.success(`➕ Added new resolve with dedupe[] into ${configPath}`);
    logger.debug(`SECURITY: created new resolve block with dedupe baseline.`);
    modified = true;
  }

  if (modified) {
    await fs.writeFile(configPath, code, 'utf8');
    logger.success(`✔ Patched Vitest config at ${configPath}`);
    logger.debug(`SECURITY: changes persisted, app is now safe against React duplication.`);
  } else {
    logger.info(`ℹ️ No changes required in ${configPath}`);
    logger.debug(`SECURITY: config already compliant, skipped patch.`);
  }
}
