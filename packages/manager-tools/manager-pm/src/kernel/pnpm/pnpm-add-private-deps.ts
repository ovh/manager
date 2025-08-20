#!/usr/bin/env node
import { consola } from 'consola';
import { promises as fs } from 'fs';
import { execSync } from 'node:child_process';
import path from 'path';

import { getPrivatePackages } from '../commons/dependencies-utils.js';
import { PackageJsonType } from '../types/commons/package-json-type.js';

const pnpmStorePath = path.resolve('./target');

/**
 * Link all private packages into the local PNPM store (`./target`).
 *
 * - Scans core/modules/components for private packages.
 * - Runs `pnpm link --dir ./target` in each private package.
 * - Does **not** topo-sort (since `pnpm link` does not install).
 */
export async function linkPrivateDeps(): Promise<void> {
  consola.start('🔍 Scanning for private packages...');
  const privatePackageDirs = await getPrivatePackages();
  consola.info(`Found ${privatePackageDirs.length} private packages.`);

  for (const packageDir of privatePackageDirs) {
    const packageJsonPath = path.join(packageDir, 'package.json');
    const raw = await fs.readFile(packageJsonPath, 'utf-8');
    const pkg = JSON.parse(raw) as PackageJsonType;

    if (!pkg.name) continue;

    consola.info(`🔗 Linking ${pkg.name} from ${packageDir} into local store...`);

    try {
      execSync(`pnpm link --dir ${pnpmStorePath}`, {
        cwd: packageDir,
        stdio: 'inherit',
      });
      consola.success(`✔ Linked ${pkg.name}`);
    } catch (e) {
      consola.error(`❌ Failed to link ${pkg.name}:`, (e as Error).message);
    }
  }

  consola.box(`✅ All private packages linked into ${pnpmStorePath}`);
}
