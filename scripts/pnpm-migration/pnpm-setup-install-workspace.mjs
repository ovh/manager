#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync, mkdirSync, promises as fs } from 'fs';
import os from 'os';
import path from 'path';

const version = '10.11.1';
const targetDir = path.resolve('./target/pnpm');
const pnpmPath = path.join(targetDir, 'pnpm');
const CLEAN_ROOT = path.resolve('./packages');
const FOLDERS_TO_REMOVE = new Set(['dist', '.turbo']);
const INSTALL_SCRIPT = path.resolve('./scripts/pnpm-migration/pnpm-install-dependencies.mjs');
const REFRESH_FLAG = path.resolve('.yarn-refreshed');

const args = process.argv.slice(2);
const shouldClean = args.includes('--clean');

// ✅ Check if Yarn refresh already happened
function hasYarnBeenRefreshed() {
  return existsSync(REFRESH_FLAG);
}

// 📝 Mark refresh done
async function markYarnRefreshed() {
  await fs.writeFile(REFRESH_FLAG, 'ok\n');
}

// 🧹 Cleanup flag on second run
async function clearYarnRefreshFlag() {
  if (existsSync(REFRESH_FLAG)) {
    await fs.unlink(REFRESH_FLAG).catch(() => {});
    console.log('🧹 Yarn refresh flag cleared. Ready for next cycle.');
    process.exit(0); // graceful exit
  }
}

// Safe clean temporary resources
process.on('SIGINT', () => {
  console.log('\n🛑 Caught SIGINT (Ctrl+C). Cleaning up...');
  clearYarnRefreshFlag();
});

// Safe clean temporary resources
process.on('SIGTERM', () => {
  console.log('\n🛑 Caught SIGTERM. Cleaning up...');
  clearYarnRefreshFlag();
});

// 🔹 Recursively delete specified folders (excluding node_modules)
async function findAndRemoveDirs(root, dirNames = FOLDERS_TO_REMOVE) {
  const entries = await fs.readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') continue;
      if (dirNames.has(entry.name)) {
        console.log(`🧹 Removing ${entryPath}`);
        await fs.rm(entryPath, { recursive: true, force: true });
      } else {
        await findAndRemoveDirs(entryPath, dirNames);
      }
    }
  }
}

// 🧹 Clean folders from root and inside CLEAN_ROOT
async function cleanWorkspace() {
  console.log('🧹 Cleaning matching folders in root and inside packages/...');
  await findAndRemoveDirs(path.resolve('.'));
  await findAndRemoveDirs(CLEAN_ROOT);
  console.log('✅ Workspace clean complete.');
}

// ⬇️ Install PNPM locally in target/
function installPnpm() {
  console.log(`⬇️ Installing PNPM v${version} locally...`);
  mkdirSync(targetDir, { recursive: true });

  const platform = os.platform();
  const shell = platform === 'win32' ? 'powershell' : '/bin/bash';
  const installScript = platform === 'win32'
    ? 'powershell -Command "Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression"'
    : `curl -fsSL https://get.pnpm.io/install.sh | env SHELL=${shell} PNPM_VERSION=${version} PNPM_HOME=${targetDir} sh -`;

  try {
    execSync(installScript, { stdio: 'inherit' });
    console.log(`✅ PNPM v${version} installed in ${targetDir}`);
  } catch (err) {
    console.error('❌ Failed to install PNPM:', err.message);
    process.exit(1);
  }
}

// 🧪 Ensure PNPM was correctly installed
function verifyInstall() {
  if (existsSync(pnpmPath)) {
    console.log(`✔ pnpm is available at ${pnpmPath}`);
  } else {
    console.error(`❌ pnpm not found at ${pnpmPath} after install.`);
    process.exit(1);
  }
}

// 📦 Trigger install logic
function runInstallDependencies() {
  console.log('📦 Installing app and shared dependencies...');
  try {
    execSync(`node ${INSTALL_SCRIPT}`, { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully.');
  } catch (err) {
    console.error('❌ Failed to install dependencies:', err.message);
    process.exit(1);
  }
}

// 🔁 Refresh Yarn to restore environment (e.g., husky)
function refreshYarn() {
  console.log('🔁 Refreshing Yarn (force reinstall to fix husky env)...');
  try {
    execSync('yarn install --force', { stdio: 'inherit' });
    console.log('✅ Yarn refresh complete.');
  } catch (err) {
    console.warn('⚠️ Yarn refresh failed:', err.message);
  }
}

// 🔁 Main entry
(async () => {
  // Exit if this is the second pass
  await clearYarnRefreshFlag();

  // Clear all generated pnpm assets and resources
  if (shouldClean) {
    await cleanWorkspace();
  } else {
    console.log('ℹ️ Skipping workspace cleaning (use --clean to enable it).');
  }

  // Install pnpm binary inside root/target/pnpm
  if (!existsSync(pnpmPath)) {
    installPnpm();
  } else {
    console.log('✔ pnpm is already installed locally.');
  }

  // Check if pnpm is installed else we exit
  verifyInstall();

  // Install shared and applications dependencies
  runInstallDependencies();

  // Refresh yarn (once)
  if (!hasYarnBeenRefreshed()) {
    await markYarnRefreshed();
    console.log('🔁 First pass done. Re-running yarn install to finalize environment...');
    refreshYarn();
    process.exit(0); // exit cleanly
  }
})();
