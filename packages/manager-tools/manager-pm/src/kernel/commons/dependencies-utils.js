import { promises as fs } from "node:fs";
import path from "node:path";

import { ignoredDirectories, privateWorkspaces } from "../../playbook/pnpm-config.js";
import { logger } from "./log-manager.js";

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
            !entry.name.startsWith('.') // skip hidden dirs
        )
        .map((entry) => findPackages(path.join(rootDir, entry.name))),
    );

    const packageJsonPath = path.join(rootDir, "package.json");
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
 * Collect all private packages under the manager repo roots.
 *
 * - Recursively scans configured workspaces.
 * - Filters only `private` packages with a `name` field.
 * - Logs counts and sample paths.
 *
 * @returns {Promise<string[]>} List of directories containing private packages.
 */
export async function getPrivatePackages() {
  logger.debug("getPrivatePackages()");
  let allPackageDirs = [];

  for (const workspaceRoot of privateWorkspaces) {
    logger.info(`🔎 Scanning workspace root: ${workspaceRoot}`);
    const foundPackageDirs = await findPackages(workspaceRoot);
    logger.debug(`Found ${foundPackageDirs.length} package dirs under ${workspaceRoot}`);
    allPackageDirs = allPackageDirs.concat(foundPackageDirs);
  }

  const privatePackageDirs = [];
  for (const packageDir of allPackageDirs) {
    try {
      const raw = await fs.readFile(path.join(packageDir, "package.json"), "utf-8");
      const pkg = JSON.parse(raw);
      if (pkg.private && pkg.name) {
        privatePackageDirs.push(packageDir);
        logger.debug(`✔ Private package detected: ${pkg.name} (${packageDir})`);
      } else {
        logger.debug(`ℹ Non-private or unnamed package skipped: ${packageDir}`);
      }
    } catch (err) {
      logger.warn(`⚠️ Could not read/parse package.json in ${packageDir}: ${err.message}`);
    }
  }

  logger.info(`📦 Total private packages found: ${privatePackageDirs.length}`);
  logger.debug(
    `Sample private packages: ${privatePackageDirs.slice(0, 5).join(", ")}${
      privatePackageDirs.length > 5 ? " ..." : ""
    }`
  );

  return privatePackageDirs;
}
