import { execSync } from 'node:child_process';
import { constants, existsSync, promises as fs, readFileSync } from 'node:fs';
import path from 'node:path';

import {
  ignoredDirectories,
  managerRootPath,
  privateModulesPath,
  reactCriticalDependenciesPath,
} from '../../playbook/playbook-config.js';
import { logger } from './log-manager.js';

/**
 * Attempt to read the installed version of a dependency by checking its
 * `package.json` inside `node_modules` at the given base directory.
 *
 * - Looks for: `<baseDir>/node_modules/<pkgName>/package.json`
 * - Returns the `version` field if available.
 * - Returns `null` if the package is not installed, the file does not exist,
 *   or the JSON cannot be parsed.
 * - Logs a warning if parsing the package.json fails.
 *
 * @param {string} pkgName - The dependency name (e.g., "react", "vite").
 * @param {string} baseDir - The directory to check for `node_modules`.
 * @returns {string|null} The resolved version string, or `null` if not found or unreadable.
 */
function tryReadInstalledVersion(pkgName, baseDir) {
  const pkgPath = path.join(baseDir, 'node_modules', pkgName, 'package.json');
  if (existsSync(pkgPath)) {
    try {
      const raw = readFileSync(pkgPath, 'utf8');
      return JSON.parse(raw).version;
    } catch (err) {
      logger.warn(`⚠️ Failed to read version for ${pkgName} at ${pkgPath}: ${err.message}`);
    }
  }
  return null;
}

/**
 * Resolve installed version, retrying once with `yarn install` if needed.
 *
 * @param {string} pkgName - Dependency name.
 * @param {string} relAppPath - Application workspace path.
 * @returns {string|null} Version string if resolved, otherwise null.
 */
function resolveInstalledVersionWithRetry(pkgName, relAppPath) {
  const tryResolve = () =>
    tryReadInstalledVersion(pkgName, relAppPath) ||
    tryReadInstalledVersion(pkgName, managerRootPath);

  // First attempt
  let version = tryResolve();
  if (version) return version;

  // Retry guard
  logger.warn(
    `⚠️ Could not resolve ${pkgName}. Running "yarn install" at repo root (one-time retry)...`,
  );
  try {
    execSync('yarn install', {
      cwd: managerRootPath,
      stdio: 'inherit',
    });
  } catch (err) {
    logger.error(`❌ "yarn install" failed: ${err.message}`);
    return null;
  }

  // Final attempt after reinstall
  version = tryResolve();
  if (!version) {
    logger.error(`❌ Still could not resolve ${pkgName} after retry.`);
  }
  return version;
}

/**
 * Load the list of critical React dependencies from JSON.
 *
 * Reads the `pnpm-critical-deps.json` file configured in `reactCriticalDependenciesPath`
 * and parses it into an array of package names.
 *
 * - Throws if the file exists but does not contain a valid array.
 * - Used to enforce version pinning for React and ecosystem packages.
 *
 * @returns {Promise<string[]>} Array of critical dependency names (e.g., ["react", "react-dom"]).
 *
 * @throws {Error} If the JSON is invalid or not an array.
 */
async function loadCriticalReactDeps() {
  const raw = await fs.readFile(reactCriticalDependenciesPath, 'utf8');
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error(`Invalid format in ${reactCriticalDependenciesPath}: expected array`);
  }
  return parsed;
}

/**
 * Normalize React-related dependencies in an app's `package.json`
 * to the exact versions Yarn v1 installed (read from `node_modules`).
 *
 * Why?
 * - Prevents regressions in React runtime, TypeScript types,
 *   linting, and tests during PNPM migration.
 * - Guarantees consistency across all PNPM-managed apps.
 *
 * Behavior:
 * - Loads critical dependencies list from `pnpm-critical-deps.json`.
 * - For each dependency present in the app's `package.json`, attempts to
 *   resolve its installed version from either:
 *   • App-local `node_modules`
 *   • Root hoisted `node_modules`
 * - If not found, runs `yarn install` once and retries.
 * - Updates the app's `package.json` in-place with the resolved versions.
 *
 * Failure conditions:
 * - If any critical dependency is missing after retry,
 *   migration aborts with an error.
 *
 * @param {string} relAppPath - Relative path to the app workspace (containing `package.json`).
 * @returns {Promise<void>} Resolves once dependencies are normalized.
 *
 * @throws {Error} If required dependencies cannot be resolved.
 */
export async function normalizeReactDependencies(relAppPath) {
  logger.info(`
------------------------------------------------------------
⚠️  Mandatory step: Normalizing React & related dependencies
   To prevent regressions in React, types, tests, and lint.
------------------------------------------------------------
  `);

  const pkgFile = path.join(relAppPath, 'package.json');
  const pkg = JSON.parse(await fs.readFile(pkgFile, 'utf8'));
  const criticalDeps = await loadCriticalReactDeps();

  const missingDeps = [];

  for (const dep of criticalDeps) {
    if (pkg.dependencies?.[dep] || pkg.devDependencies?.[dep]) {
      const version = resolveInstalledVersionWithRetry(dep, relAppPath);
      if (version) {
        if (pkg.dependencies?.[dep]) {
          pkg.dependencies[dep] = version;
        } else {
          pkg.devDependencies[dep] = version;
        }
        logger.info(`📌 Pinned ${dep} → ${version}`);
      } else {
        missingDeps.push(dep);
      }
    }
  }

  if (missingDeps.length > 0) {
    throw new Error(
      `❌ Migration aborted: failed to resolve critical React deps (${missingDeps.join(', ')})`,
    );
  }

  await fs.writeFile(pkgFile, JSON.stringify(pkg, null, 2));
  logger.success(`✅ React dependencies normalized for ${relAppPath}`);
}

/**
 * Recursively search a directory for `package.json` files.
 *
 * - Skips ignored and hidden directories.
 * - Logs progress and results at each recursion.
 *
 * @param {string} rootDir - The root directory to scan.
 * @returns {Promise<string[]>} Array of directories containing a `package.json`.
 */
export async function findPackages(rootDir) {
  logger.debug(`findPackages(rootDir="${rootDir}")`);
  try {
    const entries = await fs.readdir(rootDir, { withFileTypes: true });

    const nestedPackageDirs = await Promise.all(
      entries
        .filter(
          (entry) =>
            entry.isDirectory() &&
            !ignoredDirectories.has(entry.name) && // skip ignored dirs
            !entry.name.startsWith('.'), // skip hidden dirs
        )
        .map((entry) => findPackages(path.join(rootDir, entry.name))),
    );

    const packageJsonPath = path.join(rootDir, 'package.json');
    try {
      await fs.access(packageJsonPath);
      logger.debug(`📦 Found package.json in: ${rootDir}`);
      // Current dir is a package
      return [rootDir, ...nestedPackageDirs.flat()];
    } catch {
      // Not a package.json here
      return nestedPackageDirs.flat();
    }
  } catch (err) {
    logger.error(`❌ Failed to scan directory ${rootDir}: ${err.message}`);
    logger.debug(`Stack trace: ${err.stack}`);
    return [];
  }
}

/**
 * Loads the list of private package directories from a static JSON file.
 *
 * - Validates that the file exists and is a valid JSON array of strings.
 * - Provides detailed logs on success and failure.
 *
 * @async
 * @function getPrivatePackages
 * @returns {Promise<string[]>} A promise resolving to an array of private package directory paths.
 *
 * @throws Logs errors and returns an empty array if:
 *   - the file does not exist,
 *   - the JSON is malformed,
 *   - the contents are not a valid array of strings.
 */
export async function getPrivatePackages() {
  try {
    // Ensure the file exists before reading
    await fs.access(privateModulesPath, constants.F_OK);

    const privateModules = await fs.readFile(privateModulesPath, 'utf-8');
    let privatePackageDirs;

    try {
      privatePackageDirs = JSON.parse(privateModules);
    } catch (parseErr) {
      logger.error(`❌ Failed to parse JSON from ${privateModulesPath}: ${parseErr.message}`);
      return [];
    }

    // Validate structure: must be an array of strings
    if (!Array.isArray(privatePackageDirs)) {
      logger.error(`❌ Invalid format: expected an array in ${privateModulesPath}`);
      return [];
    }
    if (!privatePackageDirs.every((p) => typeof p === 'string')) {
      logger.warn(`⚠️ Some entries in ${privateModulesPath} are not strings. Filtering them out.`);
      privatePackageDirs = privatePackageDirs.filter((p) => typeof p === 'string');
    }

    logger.info(`📦 Total private packages loaded: ${privatePackageDirs.length}`);
    logger.debug(
      `Sample private packages: ${privatePackageDirs.slice(0, 5).join(', ')}${
        privatePackageDirs.length > 5 ? ' ...' : ''
      }`,
    );

    return privatePackageDirs;
  } catch (err) {
    logger.error(`❌ Failed to read private modules file at ${privateModulesPath}: ${err.message}`);
    return [];
  }
}
