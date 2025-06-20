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
    process.exit(0);
  }
}

// Safe cleanup on interrupt signals
process.on('SIGINT', () => {
  console.log('\n🛑 Caught SIGINT. Cleaning up...');
  clearYarnRefreshFlag();
});
process.on('SIGTERM', () => {
  console.log('\n🛑 Caught SIGTERM. Cleaning up...');
  clearYarnRefreshFlag();
});

// ⬇️ Download and install PNPM binary directly into targetDir
function installPnpm() {
  console.log(`⬇️ Downloading PNPM v${version} binary...`);
  mkdirSync(targetDir, { recursive: true });

  const platform = os.platform();
  const arch = os.arch();

  let binaryName = '';
  if (platform === 'darwin') {
    binaryName = arch === 'arm64' ? 'pnpm-macos-arm64' : 'pnpm-macos-x64';
  } else if (platform === 'linux') {
    binaryName = arch === 'arm64' ? 'pnpm-linux-arm64' : 'pnpm-linux-x64';
  } else if (platform === 'win32') {
    binaryName = 'pnpm-win.exe';
  } else {
    console.error(`❌ Unsupported platform: ${platform}-${arch}`);
    process.exit(1);
  }

  const url = `https://github.com/pnpm/pnpm/releases/download/v${version}/${binaryName}`;
  const outputPath = pnpmPath + (platform === 'win32' ? '.exe' : '');

  try {
    execSync(`curl -fsSL ${url} -o ${outputPath}`, { stdio: 'inherit' });
    execSync(`chmod +x ${outputPath}`);
    console.log(`✅ PNPM v${version} downloaded to ${outputPath}`);
  } catch (err) {
    console.error('❌ Failed to download PNPM binary:', err.message);
    process.exit(1);
  }
}

// ✅ Check if PNPM binary is functional
function verifyInstall() {
  const testCmd = pnpmPath + (os.platform() === 'win32' ? '.exe' : '');
  try {
    execSync(`${testCmd} --version`, { stdio: 'inherit' });
    console.log(`✔ pnpm binary is working from ${testCmd}`);
  } catch {
    console.error('❌ pnpm binary not working after install.');
    process.exit(1);
  }
}

// 📦 Run install logic
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
    console.log('✔ PNPM binary already exists at', pnpmPath);
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
