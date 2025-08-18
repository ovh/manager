import { execFile } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { promises as fs } from 'node:fs';
import path, { basename } from 'node:path';

import {
  applicationsBasePath,
  cleanupDirectories,
  managerRootPath,
} from '../../playbook/playbook-config.js';
import { parseAppPackageJson } from './json-utils.js';
import { logger } from './log-manager.js';

/**
 * Clean up existing build and dependency folders in an app.
 *
 * Removes:
 *  - node_modules
 *  - dist
 *  - .turbo (Turbo cache)
 *
 * @param {string} appPath - Absolute path to the app folder
 */
export async function cleanAppDirs(appPath) {
  logger.debug(`cleanAppDirs(appPath="${appPath}")`);
  for (const directory of cleanupDirectories) {
    const fullPath = path.join(appPath, directory);
    try {
      await fs.rm(fullPath, { recursive: true, force: true });
      logger.info(`🧹 [cleanup] Removed ${fullPath}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : err;
      logger.warn(`⚠️ [cleanup] Failed to remove ${fullPath}: ${message}`);
    }
  }
}

/**
 * Convert a filesystem path into POSIX format (forward slashes).
 */
function toPosix(p) {
  return p.split(path.sep).join(path.posix.sep);
}

/**
 * Check if the given path string is likely a workspace-relative path.
 */
function isLikelyWorkspacePath(p) {
  const x = toPosix(p);
  return x.startsWith('packages/') || x.startsWith('./packages/');
}

/**
 * Strip the repository root from an absolute path, returning a workspace-relative path.
 */
function stripRepoRoot(absPath) {
  const rootPosix = toPosix(managerRootPath).replace(/\/+$/, '');
  const absPosix = toPosix(absPath);
  return absPosix.startsWith(rootPosix + '/') ? absPosix.slice(rootPosix.length + 1) : absPosix;
}

/**
 * List absolute paths of all valid app directories under `packages/manager/apps`.
 */
function listAppDirsAbs() {
  const appsAbs = path.join(managerRootPath, applicationsBasePath);
  if (!existsSync(appsAbs)) return [];
  return readdirSync(appsAbs)
    .map((d) => path.join(appsAbs, d))
    .filter((p) => {
      try {
        return statSync(p).isDirectory() && existsSync(path.join(p, 'package.json'));
      } catch {
        return false;
      }
    });
}

/**
 * Find an app directory by its package.json `"name"`.
 */
function findByPackageName(pkgName) {
  for (const dirAbs of listAppDirsAbs()) {
    try {
      const raw = readFileSync(path.join(dirAbs, 'package.json'), 'utf-8');
      const pkg = JSON.parse(raw);
      if (pkg?.name === pkgName) {
        logger.debug(`✔ Found app directory for package "${pkgName}" at ${dirAbs}`);
        return stripRepoRoot(dirAbs);
      }
    } catch (err) {
      logger.warn(`⚠️ Skipping invalid package.json in ${dirAbs}: ${err.message}`);
    }
  }
  logger.error(`❌ Could not find app directory for package: ${pkgName}`);
  return null;
}

/**
 * Resolve an "app reference" (folder name, package name, workspace path,
 * or absolute path) to a workspace-relative POSIX path:
 *   "packages/manager/apps/<appName>"
 */
export function buildAppWorkspacePath(appRef) {
  logger.debug(`buildAppWorkspacePath(appRef="${appRef}")`);
  if (!appRef) throw new Error('buildAppWorkspacePath: appRef is required');

  // Case 1: workspace-style input (or './packages/...').
  if (isLikelyWorkspacePath(appRef)) {
    const result = toPosix(appRef).replace(/^\.\//, '');
    logger.info(`📂 Resolved workspace-style path: ${result}`);
    return result;
  }

  // Case 2: absolute filesystem path → normalize back to workspace path.
  if (path.isAbsolute(appRef)) {
    const rel = stripRepoRoot(appRef);
    const relPosix = toPosix(rel);
    if (!relPosix.startsWith(applicationsBasePath + '/')) {
      throw new Error(`Path is not under ${applicationsBasePath}: ${appRef}`);
    }
    logger.info(`📂 Resolved absolute path: ${relPosix}`);
    return relPosix;
  }

  // Case 3: package name (@scope/name) → find matching app folder.
  if (appRef.startsWith('@')) {
    const rel = findByPackageName(appRef);
    if (rel) {
      logger.info(`📦 Resolved package "${appRef}" to ${rel}`);
      return toPosix(rel);
    }
    throw new Error(`Could not resolve package "${appRef}" under ${applicationsBasePath}`);
  }

  // Case 4: bare folder name → construct canonical workspace path.
  const result = path.posix.join(applicationsBasePath, appRef);
  logger.info(`📂 Resolved bare folder name: ${result}`);
  return result;
}

/**
 * Get the absolute filesystem path to the app folder for any accepted `appRef`.
 */
export function buildAppAbsolutePath(appRef) {
  logger.debug(`buildAppAbsolutePath(appRef="${appRef}")`);
  const rel = buildAppWorkspacePath(appRef);
  const abs = path.join(managerRootPath, rel);
  logger.info(`📂 Absolute path for "${appRef}": ${abs}`);
  return abs;
}

/**
 * Get application ID (directory basename) from Yarn workspaces info.
 *
 * @param {string} packageName - NPM package name
 * @returns {Promise<string>} Application directory ID
 */
export async function getApplicationId(packageName) {
  logger.debug(`getApplicationId(packageName="${packageName}")`);

  // 1) Local discovery first (works for PNPM-only apps)
  const rel = findByPackageName(packageName);
  if (rel) return basename(rel);

  // 2) Fallback to Yarn (classic v1 can be noisy)
  try {
    const stdout = await new Promise((resolve, reject) => {
      execFile('yarn', ['workspaces', 'info'], (err, out, errOut) =>
        err ? reject(errOut || err) : resolve(out),
      );
    });
    // extract JSON between the first '{' and last '}'
    const s = stdout.slice(stdout.indexOf('{'), stdout.lastIndexOf('}') + 1);
    const info = JSON.parse(s);
    const ws = info[packageName];
    if (ws?.location) return basename(ws.location);
  } catch (e) {
    logger.debug(`Yarn fallback failed: ${e}`);
  }

  throw new Error(`Workspace info not found for package: ${packageName}`);
}

/**
 * List all applications available for a given workspace.
 *
 * @returns {Array<{ name: string, value: string, regions?: unknown }>}
 */
export function getApplications() {
  logger.debug('getApplications()');
  const apps = readdirSync(applicationsBasePath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map(({ name }) => ({ application: name }))
    .filter(({ application }) =>
      existsSync(path.join(applicationsBasePath, application, 'package.json')),
    )
    .map(({ application }) => {
      const pkgPath = path.join(applicationsBasePath, application, 'package.json');
      const { name, regions } = parseAppPackageJson(pkgPath);

      if (!name.includes('/')) {
        logger.error(`❌ Invalid package name "${name}" in ${pkgPath}`);
        throw new Error(`Invalid package name "${name}" in ${pkgPath}`);
      }

      const [, formattedName] = name.split('/');
      return {
        name: formattedName || '',
        value: name,
        regions,
      };
    });

  logger.info(`📂 Found ${apps.length} applications under ${applicationsBasePath}`);
  logger.debug(
    `Applications sample: ${apps
      .slice(0, 5)
      .map((a) => a.value)
      .join(', ')}${apps.length > 5 ? ' ...' : ''}`,
  );
  return apps;
}

/**
 * Safely resolve the package name (`"name"` field in package.json)
 * for any accepted `appRef`.
 */
export function getPackageNameFromApp(appRef) {
  logger.debug(`getPackageNameFromApp(appRef="${appRef}")`);
  try {
    const abs = buildAppAbsolutePath(appRef);
    const raw = readFileSync(path.join(abs, 'package.json'), 'utf-8');
    const pkg = JSON.parse(raw);
    logger.info(`📦 Package name for "${appRef}": ${pkg?.name}`);
    return pkg?.name ?? null;
  } catch (err) {
    logger.warn(`⚠️ Could not resolve package name for ${appRef}: ${err.message}`);
    return null;
  }
}
