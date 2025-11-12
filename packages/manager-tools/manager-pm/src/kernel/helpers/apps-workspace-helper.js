import { execFile } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path, { basename } from 'node:path';

import { applicationsBasePath, managerRootPath } from '../../playbook/playbook-config.js';
import { parseAppPackageJson } from '../utils/json-utils.js';
import { logger } from '../utils/log-manager.js';
import { stripRepositoryRoot, toPosix } from '../utils/path-utils.js';
import { isWorkspaceRelativePath } from '../utils/workspace-utils.js';

/**
 * List absolute paths of all valid app directories under `packages/manager/apps`.
 * A valid app directory must contain a `package.json` file.
 * @returns {string[]} An array of absolute paths to app directories.
 */
function buildApplicationsAbsolutePaths() {
  const applicationsDirectory = path.join(managerRootPath, applicationsBasePath);

  if (!existsSync(applicationsDirectory)) return [];

  return readdirSync(applicationsDirectory)
    .map((directoryName) => path.join(applicationsDirectory, directoryName))
    .filter((directoryPath) => {
      try {
        return (
          statSync(directoryPath).isDirectory() &&
          existsSync(path.join(directoryPath, 'package.json'))
        );
      } catch {
        return false;
      }
    });
}

/**
 * Find an application directory by its `package.json` `"name"` field.
 * @param {string} packageName - The package name to search for.
 * @returns {string|null} The workspace-relative path to the app directory, or null if not found.
 */
function findApplicationByPackageName(packageName) {
  for (const applicationDirectory of buildApplicationsAbsolutePaths()) {
    try {
      const packageJsonContent = readFileSync(
        path.join(applicationDirectory, 'package.json'),
        'utf-8',
      );
      const packageData = JSON.parse(packageJsonContent);

      if (packageData?.name === packageName) {
        logger.debug(
          `✔ Found app directory for package "${packageName}" at ${applicationDirectory}`,
        );
        return stripRepositoryRoot(applicationDirectory);
      }
    } catch (error) {
      logger.warn(`⚠️ Skipping invalid package.json in ${applicationDirectory}: ${error.message}`);
    }
  }

  logger.error(`❌ Could not find app directory for package: ${packageName}`);
  return null;
}

/**
 * Resolve an "app reference" (folder name, package name, workspace path, or absolute path)
 * to a workspace-relative POSIX path: `"packages/manager/apps/<appName>"`.
 *
 * @param {string} appRef - The app reference to resolve. Can be a folder name, package name, workspace path, or absolute path.
 * @returns {string} The workspace-relative POSIX path for the app.
 * @throws {Error} If the reference is invalid or cannot be resolved.
 */
export function buildApplicationWorkspacePath(appRef) {
  logger.debug(`buildAppWorkspacePath(appRef="${appRef}")`);
  if (!appRef) throw new Error('buildApplicationWorkspacePath: appRef is required');

  // Case 1: Workspace-style input (e.g., 'packages/...' or './packages/...').
  if (isWorkspaceRelativePath(appRef)) {
    const workspacePath = toPosix(appRef).replace(/^\.\//, '');
    logger.info(`📂 Resolved workspace-style path: ${workspacePath}`);
    return workspacePath;
  }

  // Case 2: Absolute filesystem path → normalize back to workspace path.
  if (path.isAbsolute(appRef)) {
    const relativePath = stripRepositoryRoot(appRef);
    const relativePosixPath = toPosix(relativePath);
    if (!relativePosixPath.startsWith(`${applicationsBasePath}/`)) {
      throw new Error(`Path is not under ${applicationsBasePath}: ${appRef}`);
    }
    logger.info(`📂 Resolved absolute path: ${relativePosixPath}`);
    return relativePosixPath;
  }

  // Case 3: Package name (@scope/name) → find matching app folder.
  if (appRef.startsWith('@')) {
    const relativePath = findApplicationByPackageName(appRef);
    if (relativePath) {
      logger.info(`📦 Resolved package "${appRef}" to ${relativePath}`);
      return toPosix(relativePath);
    }
    throw new Error(`Could not resolve package "${appRef}" under ${applicationsBasePath}`);
  }

  // Case 4: Bare folder name → construct canonical workspace path.
  const workspacePath = path.posix.join(applicationsBasePath, appRef);
  logger.info(`📂 Resolved bare folder name: ${workspacePath}`);
  return workspacePath;
}

/**
 * Get the absolute filesystem path to the app folder for any accepted `appRef`.
 *
 * @param {string} appRef - The app reference to resolve.
 * @returns {string} The absolute filesystem path to the app directory.
 */
export function buildApplicationAbsolutePath(appRef) {
  logger.debug(`buildApplicationAbsolutePath(appRef="${appRef}")`);

  const relativePath = buildApplicationWorkspacePath(appRef);
  const absolutePath = path.join(managerRootPath, relativePath);

  logger.info(`📂 Absolute path for "${appRef}": ${absolutePath}`);

  return absolutePath;
}

/**
 * Safely resolve the package name (`"name"` field in package.json)
 * for any accepted `appRef`.
 *
 * @param {string} applicationReference - The application reference to resolve.
 * @returns {string|null} The package name, or null if it could not be determined.
 */
export function getPackageNameFromApplication(applicationReference) {
  try {
    logger.debug(`getPackageNameFromApp(applicationReference="${applicationReference}")`);

    const applicationAbsolutePath = buildApplicationAbsolutePath(applicationReference);

    const applicationPackageJsonContent = readFileSync(
      path.join(applicationAbsolutePath, 'package.json'),
      'utf-8',
    );

    const applicationPackageData = JSON.parse(applicationPackageJsonContent);

    logger.info(`📦 Package name for "${applicationReference}": ${applicationPackageData?.name}`);

    return applicationPackageData?.name ?? null;
  } catch (error) {
    logger.warn(`⚠️ Could not resolve package name for ${applicationReference}: ${error.message}`);
    return null;
  }
}

/**
 * List all applications available for the current workspace.
 *
 * @returns {Array<{ name: string, value: string, regions?: unknown }>} A list of applications with metadata.
 * @throws {Error} If any package has an invalid name format.
 */
export function getApplications() {
  logger.debug('getApplications()');

  const directoryEntries = readdirSync(applicationsBasePath, { withFileTypes: true });

  const applications = directoryEntries
    .filter((entry) => entry.isDirectory())
    .map(({ name }) => ({ directoryName: name }))
    .filter(({ directoryName }) =>
      existsSync(path.join(applicationsBasePath, directoryName, 'package.json')),
    )
    .map(({ directoryName }) => {
      const packageJsonPath = path.join(applicationsBasePath, directoryName, 'package.json');
      const { name: packageName, regions } = parseAppPackageJson(packageJsonPath);

      if (!packageName.includes('/')) {
        logger.error(`❌ Invalid package name "${packageName}" in ${packageJsonPath}`);
        throw new Error(`Invalid package name "${packageName}" in ${packageJsonPath}`);
      }

      const [, formattedName] = packageName.split('/');
      return {
        name: formattedName || '',
        value: packageName,
        regions,
      };
    });

  logger.info(`📂 Found ${applications.length} applications under ${applicationsBasePath}`);
  logger.debug(
    `Applications sample: ${applications
      .slice(0, 5)
      .map((app) => app.value)
      .join(', ')}${applications.length > 5 ? ' ...' : ''}`,
  );

  return applications;
}

/**
 * Get the application ID (directory basename) from Yarn workspaces info or local discovery.
 *
 * @param {string} packageName - The NPM package name to look up.
 * @returns {Promise<string>} The application directory ID (basename).
 * @throws {Error} If the workspace information cannot be found.
 */
export async function getApplicationId(packageName) {
  logger.debug(`getApplicationId(packageName="${packageName}")`);

  // 1) Local discovery first (works for PNPM-only apps)
  const relativePath = findApplicationByPackageName(packageName);
  if (relativePath) return basename(relativePath);

  // 2) Fallback to Yarn (classic v1 may be verbose)
  try {
    const stdout = await new Promise((resolve, reject) => {
      execFile('yarn', ['workspaces', 'info'], (error, output, errorOutput) =>
        error ? reject(errorOutput || error) : resolve(output),
      );
    });

    // Extract JSON block between the first '{' and the last '}'
    const jsonBlock = stdout.slice(stdout.indexOf('{'), stdout.lastIndexOf('}') + 1);
    const workspacesInfo = JSON.parse(jsonBlock);
    const workspaceEntry = workspacesInfo[packageName];

    if (workspaceEntry?.location) {
      return basename(workspaceEntry.location);
    }
  } catch (error) {
    logger.debug(`Yarn fallback failed: ${error}`);
  }

  throw new Error(`Workspace info not found for package: ${packageName}`);
}
