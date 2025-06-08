#!/usr/bin/env node
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');
const migrationDataPath = path.resolve(repoRoot, 'packages-apps-migration-data.json');

// Utility to check for file existence
function fileExists(p) {
  try {
    return existsSync(p);
  } catch {
    return false;
  }
}

// Recursively remove directories like node_modules, dist, .turbo
async function findAndRemoveDirs(root, dirNames = new Set()) {
  const entries = await fs.readdir(root, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(root, entry.name);

    if (entry.isDirectory()) {
      if (dirNames.has(entry.name)) {
        console.log(`🧹 Removing ${entryPath}`);
        await fs.rm(entryPath, { recursive: true, force: true });
      } else {
        await findAndRemoveDirs(entryPath, dirNames);
      }
    }
  }
}

// Load the migration config file safely
async function getMigrationData() {
  try {
    if (!fileExists(migrationDataPath)) {
      console.warn(`⚠️ Migration data file not found: ${migrationDataPath}`);
      return { excludeYarnApps: [], pnpmLinkModules: {} };
    }

    const raw = await fs.readFile(migrationDataPath, 'utf-8');
    const data = JSON.parse(raw);

    return {
      excludeYarnApps: Array.isArray(data['exclude-yarn-apps']) ? data['exclude-yarn-apps'] : [],
      pnpmLinkModules:
        typeof data['pnpm-link-modules'] === 'object' && data['pnpm-link-modules'] !== null
          ? data['pnpm-link-modules']
          : {}
    };
  } catch (err) {
    console.error('❌ Failed to read or parse migration data:', err.message);
    return { excludeYarnApps: [], pnpmLinkModules: {} };
  }
}

// Unlink global PNPM modules
function unlinkGlobalModules(modules) {
  for (const moduleName of Object.keys(modules)) {
    console.log(`🧹 Unlinking global module: ${moduleName}`);
    try {
      execSync(`pnpm unlink --global ${moduleName}`, { stdio: 'inherit' });
    } catch (err) {
      console.warn(`⚠️ Failed to unlink ${moduleName}: ${err.message}`);
    }
  }
}

// Full cleanup operation
async function cleanEnvironment(modulesToUnlink) {
  console.log('🧹 Cleaning node_modules, dist, .turbo in monorepo...');
  await findAndRemoveDirs(repoRoot, new Set(['node_modules', 'dist', '.turbo']));

  console.log('🧹 Unlinking global PNPM modules...');
  unlinkGlobalModules(modulesToUnlink);

  console.log('🧹 Pruning PNPM store...');
  try {
    execSync('pnpm store prune', { stdio: 'inherit' });
  } catch (err) {
    console.warn('⚠️ pnpm store prune failed:', err.message);
  }
}

// Main entry point
async function main() {
  const shouldClean = process.argv.includes('--clean');
  console.log('🚀 Running preinstall script...');

  const { pnpmLinkModules } = await getMigrationData();

  if (shouldClean) {
    console.log('🧽 --clean flag detected. Performing environment cleanup...');
    await cleanEnvironment(pnpmLinkModules);
  } else {
    console.log('ℹ️ Skipping cleanup. Use --clean to enable it.');
  }
}

main().catch(err => {
  console.error('❌ Preinstall error:', err.message);
  process.exit(1);
});
