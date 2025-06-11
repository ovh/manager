#!/usr/bin/env node
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationDataPath = path.resolve(__dirname, 'packages-apps-migration-data.json');

const repoRoot = path.resolve(__dirname, '..', '..');
const pnpmBinary = path.resolve(repoRoot, 'target/pnpm/pnpm');
const pnpmStorePath = path.resolve(repoRoot, 'target/.pnpm-store');
const setupScript = path.resolve(__dirname, 'setup-local-pnpm.mjs');

const filesToClean = ['node_modules', 'dist', '.turbo', 'pnpm-lock.yaml'];

// Utility
function fileExists(p) {
  try {
    return existsSync(p);
  } catch {
    return false;
  }
}

// Ensure local PNPM exists by calling the setup script
function ensureLocalPnpmInstalled() {
  if (!fileExists(pnpmBinary)) {
    console.warn('⚠️ Local PNPM not found. Bootstrapping setup...');
    try {
      execSync(`node ${setupScript}`, { stdio: 'inherit' });
    } catch (err) {
      console.error('❌ Failed to install local PNPM:', err.message);
      process.exit(1);
    }
  } else {
    console.log(`✔ Using local PNPM at ${pnpmBinary}`);
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
      return {
        excludeYarnApps: [],
        pnpmLinkDependencies: {},
        pnpmLinkDevDependencies: {}
      };
    }

    const raw = await fs.readFile(migrationDataPath, 'utf-8');
    const data = JSON.parse(raw);

    return {
      excludeYarnApps: Array.isArray(data['exclude-yarn-apps']) ? data['exclude-yarn-apps'] : [],
      pnpmLinkDependencies:
        typeof data['pnpm-link-dependencies'] === 'object' && data['pnpm-link-dependencies'] !== null
          ? data['pnpm-link-dependencies']
          : {},
      pnpmLinkDevDependencies:
        typeof data['pnpm-link-devDependencies'] === 'object' && data['pnpm-link-devDependencies'] !== null
          ? data['pnpm-link-devDependencies']
          : {}
    };
  } catch (err) {
    console.error('❌ Failed to read or parse migration data:', err.message);
    return {
      excludeYarnApps: [],
      pnpmLinkDependencies: {},
      pnpmLinkDevDependencies: {}
    };
  }
}

// Check which modules are actually used in apps
async function getUsedModules(allModules, apps) {
  const used = new Set();

  for (const app of apps) {
    const pkgPath = path.join(repoRoot, app, 'package.json');
    if (!fileExists(pkgPath)) continue;

    try {
      const raw = await fs.readFile(pkgPath, 'utf-8');
      const pkg = JSON.parse(raw);

      const deps = Object.assign({}, pkg.dependencies || {}, pkg.devDependencies || {});
      for (const name of Object.keys(allModules)) {
        if (deps[name]) used.add(name);
      }
    } catch {
      continue;
    }
  }

  return [...used];
}

// Unlink global PNPM modules that are used
function unlinkGlobalModules(usedModules) {
  for (const moduleName of usedModules) {
    console.log(`🧹 Unlinking global module: ${moduleName}`);
    try {
      execSync(`${pnpmBinary} unlink --global ${moduleName}`, { stdio: 'inherit' });
    } catch (err) {
      console.warn(`⚠️ Failed to unlink ${moduleName}: ${err.message}`);
    }
  }
}

// Clean environment
async function cleanEnvironment(apps, deps, devDeps) {
  console.log('🧹 Cleaning node_modules, dist, .turbo in monorepo...');
  await findAndRemoveDirs(repoRoot, new Set(filesToClean));

  const usedDepModules = await getUsedModules(deps, apps);
  const usedDevDepModules = await getUsedModules(devDeps, apps);

  console.log('🧹 Unlinking used global PNPM modules...');
  unlinkGlobalModules([...usedDepModules, ...usedDevDepModules]);

  console.log(`🧹 Removing local PNPM store at ${pnpmStorePath}`);
  try {
    await fs.rm(pnpmStorePath, { recursive: true, force: true });
  } catch (err) {
    console.warn(`⚠️ Failed to remove local PNPM store: ${err.message}`);
  }

  console.log('🧹 Pruning PNPM store (just in case)...');
  try {
    execSync(`${pnpmBinary} store prune`, { stdio: 'inherit' });
  } catch (err) {
    console.warn(`⚠️ pnpm store prune failed: ${err.message}`);
  }
}

// Main
async function main() {
  const shouldClean = process.argv.includes('--clean');
  console.log('🚀 Running preinstall script...');

  ensureLocalPnpmInstalled();

  const { excludeYarnApps, pnpmLinkDependencies, pnpmLinkDevDependencies } = await getMigrationData();

  if (shouldClean) {
    console.log('🧽 --clean flag detected. Performing environment cleanup...');
    await cleanEnvironment(excludeYarnApps, pnpmLinkDependencies, pnpmLinkDevDependencies);
  } else {
    console.log('ℹ️ Skipping cleanup. Use --clean to enable it.');
  }
}

main().catch(err => {
  console.error('❌ Preinstall error:', err.message);
  process.exit(1);
});
