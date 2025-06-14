#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync, mkdirSync, promises as fs } from 'fs';
import os from 'os';
import path from 'path';

const version = '10.11.1';
const targetDir = path.resolve('./target/pnpm');
const pnpmPath = path.join(targetDir, 'pnpm');
const INSTALL_SCRIPT = path.resolve('./scripts/pnpm-migration/pnpm-install-dependencies.mjs');
const REFRESH_FLAG = path.resolve('.yarn-refreshed');

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

// Cleanup on interrupt signals
process.on('SIGINT', () => {
  console.log('\n🛑 Caught SIGINT. Cleaning up...');
  clearYarnRefreshFlag();
});
process.on('SIGTERM', () => {
  console.log('\n🛑 Caught SIGTERM. Cleaning up...');
  clearYarnRefreshFlag();
});

// ⬇️ Install PNPM locally
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

// 🧪 Ensure PNPM is functional
function verifyInstall() {
  if (!existsSync(pnpmPath)) {
    console.error('❌ pnpm not found after install.');
    process.exit(1);
  }
  console.log(`✔ pnpm is available at ${pnpmPath}`);
}

// 📦 Install all dependencies
function runInstallDependencies() {
  console.log('📦 Installing dependencies...');
  try {
    execSync(`node ${INSTALL_SCRIPT}`, { stdio: 'inherit' });
    console.log('✅ Dependencies installed.');
  } catch (err) {
    console.error('❌ Dependency installation failed:', err.message);
    process.exit(1);
  }
}

// 🔁 Refresh Yarn
function refreshYarn() {
  console.log('🔁 Refreshing Yarn (force reinstall)...');
  try {
    execSync('yarn install --force', { stdio: 'inherit' });
    console.log('✅ Yarn refresh complete.');
  } catch (err) {
    console.warn('⚠️ Yarn refresh failed:', err.message);
  }
}

// 🔁 Main
(async () => {
  await clearYarnRefreshFlag();

  if (!existsSync(pnpmPath)) {
    installPnpm();
  } else {
    console.log('✔ PNPM already installed.');
  }

  verifyInstall();
  runInstallDependencies();

  if (!hasYarnBeenRefreshed()) {
    await markYarnRefreshed();
    console.log('🔁 First pass done. Re-running yarn install...');
    refreshYarn();
    process.exit(0);
  }
})();
