import { promises as fs } from 'fs';
import path from 'path';

import { ignoredDirectories, privateWorkspaces } from '../../playbook/pnpm-config.js';
import { PackageJsonType } from '../types/commons/package-json-type.js';

/**
 * Recursively search a directory for `package.json` files.
 *
 * @param rootDir - The root directory to scan.
 * @returns Array of directories containing a `package.json`.
 */
export async function findPackages(rootDir: string): Promise<string[]> {
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
    // Current dir is a package
    return [rootDir, ...nestedPackageDirs.flat()];
  } catch {
    // Not a package.json here
    return nestedPackageDirs.flat();
  }
}

/**
 * Collect all private packages under the manager repo roots.
 *
 * @returns List of directories containing private packages.
 */
export async function getPrivatePackages(): Promise<string[]> {
  let allPackageDirs: string[] = [];

  for (const workspaceRoot of privateWorkspaces) {
    const foundPackageDirs = await findPackages(workspaceRoot);
    allPackageDirs = allPackageDirs.concat(foundPackageDirs);
  }

  const privatePackageDirs: string[] = [];
  for (const packageDir of allPackageDirs) {
    try {
      const raw = await fs.readFile(path.join(packageDir, 'package.json'), 'utf-8');
      const pkg = JSON.parse(raw) as PackageJsonType;
      if (pkg.private && pkg.name) {
        privatePackageDirs.push(packageDir);
      }
    } catch {
      // Ignore folders without readable package.json
    }
  }
  return privatePackageDirs;
}
