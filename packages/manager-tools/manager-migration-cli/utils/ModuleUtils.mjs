import { existsSync, readdirSync, statSync } from 'fs';
import { dirname, relative, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Detect the repo root (the folder containing "packages")
 * Works even if this script is nested deeply inside manager-tools or other subfolders.
 */
const findRepoRoot = (startDir = __dirname) => {
  let dir = startDir;
  while (dir !== '/' && !existsSync(resolve(dir, 'packages'))) {
    dir = resolve(dir, '..');
  }
  return dir;
};

const repoRoot = findRepoRoot();

export const commonModulesBasePaths = [
  resolve(repoRoot, 'packages/manager-tools'),
  resolve(repoRoot, 'packages/manager/modules'),
  resolve(repoRoot, 'packages/manager/core'),
  resolve(repoRoot, 'packages/components'),
];

/**
 * Get all modules across candidate base directories.
 * Returns both module name and moduleBasePath (relative to repo root, e.g. "packages/components").
 */
export const getAllModules = () => {
  const modules = [];

  if (!commonModulesBasePaths?.length) {
    console.warn('⚠️  No module base paths defined.');
    return [];
  }

  for (const basePath of commonModulesBasePaths) {
    if (!existsSync(basePath)) {
      console.warn(`⚠️  Skipping missing directory: ${basePath}`);
      continue;
    }

    console.log(`ℹ️  Scanning modules in: ${basePath}`);

    try {
      const subdirectories = readdirSync(basePath).filter((entry) => {
        const fullPath = resolve(basePath, entry);
        return statSync(fullPath).isDirectory();
      });

      subdirectories.forEach((moduleName) => {
        modules.push({
          moduleName,
          moduleBasePath: relative(repoRoot, basePath), // e.g. "packages/components"
        });
      });
    } catch (error) {
      console.error(`❌ Error reading modules directory: ${basePath}`);
      console.error(error);
    }
  }

  return modules;
};
