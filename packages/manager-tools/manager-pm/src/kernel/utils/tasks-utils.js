import { logger } from './log-manager.js';
import { buildAppWorkspacePath, getPackageNameFromApp } from './workspace-utils.js';

/**
 * Internal helper: derive the best Turbo filter value for a given `appRef`.
 *
 * - Prefers the package name (`@scope/name`) if available.
 * - Falls back to the last path segment of the canonical workspace path.
 *
 * @param {string} appRef - Application reference (name, package name, or path).
 * @returns {string|null} The filter string for Turbo, or `null` if unresolved.
 */
export function resolveBuildFilter(appRef) {
  logger.debug(`resolveBuildFilter(appRef="${appRef}")`);

  if (!appRef) {
    logger.warn('⚠️ No appRef provided, returning null.');
    return null;
  }

  try {
    const pkg = getPackageNameFromApp(appRef);
    if (pkg) {
      logger.info(`📦 Resolved build filter to package name: ${pkg}`);
      return pkg; // Prefer the package name (@scope/name)
    }

    const rel = buildAppWorkspacePath(appRef); // packages/manager/apps/<name>
    const parts = rel.split('/');
    const last = parts[parts.length - 1] || null;

    if (!last) {
      logger.error(`❌ Failed to resolve build filter for appRef="${appRef}". Path: ${rel}`);
      return null;
    }

    logger.info(`📂 Resolved build filter to workspace segment: ${last}`);
    return last;
  } catch (err) {
    logger.error(`❌ Exception in resolveBuildFilter for appRef="${appRef}": ${err.message}`);
    logger.debug(`Stack trace: ${err.stack}`);
    return null;
  }
}
