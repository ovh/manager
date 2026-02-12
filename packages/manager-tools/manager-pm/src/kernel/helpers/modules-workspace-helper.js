import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

import { managerRootPath, modulesBasePaths } from '../../playbook/playbook-config.js';
import { logger } from '../utils/log-manager.js';
import { stripRepositoryRoot, toPosix } from '../utils/path-utils.js';
import { isWorkspaceRelativePath } from '../utils/workspace-utils.js';

/**
 * List absolute paths of all valid module directories under known module roots.
 * A valid module directory must contain a `package.json` file.
 *
 * @returns {string[]} An array of absolute paths to module directories.
 */
function buildModulesAbsolutePaths() {
  const moduleDirectories = [];

  for (const basePath of modulesBasePaths) {
    const absoluteBase = path.join(managerRootPath, basePath);
    if (!existsSync(absoluteBase)) continue;

    const entries = readdirSync(absoluteBase);
    for (const entry of entries) {
      const candidate = path.join(absoluteBase, entry);
      try {
        if (statSync(candidate).isDirectory() && existsSync(path.join(candidate, 'package.json'))) {
          moduleDirectories.push(candidate);
        }
      } catch {
        /* ignore invalid dirs */
      }
    }
  }

  return moduleDirectories;
}

/**
 * Find a module directory by its `package.json` `"name"` field.
 *
 * @param {string} packageName - The package name to search for.
 * @returns {string|null} The workspace-relative path to the module directory, or null if not found.
 */
function findModuleByPackageName(packageName) {
  for (const moduleDirectory of buildModulesAbsolutePaths()) {
    try {
      const raw = readFileSync(path.join(moduleDirectory, 'package.json'), 'utf-8');
      const pkg = JSON.parse(raw);
      if (pkg?.name === packageName) {
        logger.debug(`✔ Found module directory for "${packageName}" at ${moduleDirectory}`);
        return stripRepositoryRoot(moduleDirectory);
      }
    } catch (err) {
      logger.warn(`⚠️ Skipping invalid package.json in ${moduleDirectory}: ${err.message}`);
    }
  }

  logger.error(`❌ Could not find module directory for package: ${packageName}`);
  return null;
}

/**
 * Resolve a "module reference" (folder name, package name, workspace path, or absolute path)
 * to a workspace-relative POSIX path such as `"packages/manager/core/api"`.
 *
 * @param {string} moduleRef - The module reference to resolve.
 * @returns {string} The workspace-relative POSIX path for the module.
 * @throws {Error} If the reference is invalid or cannot be resolved.
 */
export function buildModuleWorkspacePath(moduleRef) {
  logger.debug(`buildModuleWorkspacePath(moduleRef="${moduleRef}")`);
  if (!moduleRef) throw new Error('buildModuleWorkspacePath: moduleRef is required');

  // Case 1: Workspace-style input (e.g. 'packages/...' or './packages/...')
  if (isWorkspaceRelativePath(moduleRef)) {
    const workspacePath = toPosix(moduleRef).replace(/^\.\//, '');
    logger.info(`📂 Resolved workspace-style path: ${workspacePath}`);
    return workspacePath;
  }

  // Case 2: Absolute path → normalize to workspace path
  if (path.isAbsolute(moduleRef)) {
    const relativePath = toPosix(stripRepositoryRoot(moduleRef));
    if (!modulesBasePaths.some((base) => relativePath.startsWith(`${base}/`))) {
      throw new Error(`Path is not under a known module root: ${moduleRef}`);
    }
    logger.info(`📂 Resolved absolute path: ${relativePath}`);
    return relativePath;
  }

  // Case 3: Package name (@scope/name)
  if (moduleRef.startsWith('@')) {
    const relative = findModuleByPackageName(moduleRef);
    if (relative) {
      logger.info(`📦 Resolved package "${moduleRef}" to ${relative}`);
      return toPosix(relative);
    }
    throw new Error(`Could not resolve package "${moduleRef}" under known module roots`);
  }

  // Case 4: Bare folder name → search under known module roots
  for (const basePath of modulesBasePaths) {
    const candidate = path.join(managerRootPath, basePath, moduleRef);
    if (existsSync(path.join(candidate, 'package.json'))) {
      const workspacePath = path.posix.join(basePath, moduleRef);
      logger.info(`📂 Resolved bare folder name (candidate): ${workspacePath}`);
      return workspacePath;
    } else if (basePath.includes(moduleRef)) {
      const workspacePath = path.posix.join(basePath);
      logger.info(`📂 Resolved bare folder name (default): ${workspacePath}`);
      return workspacePath;
    }
  }

  throw new Error(`Unable to resolve module reference: ${moduleRef}`);
}

/**
 * Get the absolute filesystem path to the module folder for any accepted `moduleRef`.
 *
 * @param {string} moduleRef - The module reference to resolve.
 * @returns {string} The absolute filesystem path to the module directory.
 */
export function buildModuleAbsolutePath(moduleRef) {
  logger.debug(`buildModuleAbsolutePath(moduleRef="${moduleRef}")`);
  const relativePath = buildModuleWorkspacePath(moduleRef);
  const absolutePath = path.join(managerRootPath, relativePath);
  logger.info(`📂 Absolute path for "${moduleRef}": ${absolutePath}`);
  return absolutePath;
}

/**
 * Safely resolve the package name (`"name"` field in package.json)
 * for any accepted `moduleRef`.
 *
 * @param {string} moduleRef - The module reference to resolve.
 * @returns {string|null} The package name, or null if it could not be determined.
 */
export function getPackageNameFromModule(moduleRef) {
  try {
    logger.debug(`getPackageNameFromModule(moduleRef="${moduleRef}")`);
    const absolutePath = buildModuleAbsolutePath(moduleRef);
    const pkgData = JSON.parse(readFileSync(path.join(absolutePath, 'package.json'), 'utf-8'));
    logger.info(`📦 Package name for "${moduleRef}": ${pkgData?.name}`);
    return pkgData?.name ?? null;
  } catch (err) {
    logger.warn(`⚠️ Could not resolve package name for ${moduleRef}: ${err.message}`);
    return null;
  }
}
