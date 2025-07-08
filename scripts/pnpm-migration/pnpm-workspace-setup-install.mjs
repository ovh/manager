#!/usr/bin/env node
import { execSync, spawn } from 'child_process';
import { existsSync, mkdirSync, promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerCleanupOnSignals, safeUnlink } from './utils/cleanup-utils.mjs';

// Proper __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Config & Paths
const version = '10.11.1';
const repoRoot = path.resolve(__dirname, '../..');
const targetDir = path.resolve(repoRoot, 'target/pnpm');
const pnpmPath = path.join(targetDir, 'pnpm');
const INSTALL_SCRIPT = path.resolve(repoRoot, 'scripts/pnpm-migration/pnpm-install-app-dependencies.mjs');
const REFRESH_FLAG = path.resolve(repoRoot, '.yarn-refreshed');

// Cleanup handler
registerCleanupOnSignals(() => {
  safeUnlink(REFRESH_FLAG);
});

// ✅ Check if Yarn refresh already happened
function hasYarnBeenRefreshed() {
  return existsSync(REFRESH_FLAG);
}

// 📝 Mark refresh done
async function markYarnRefreshed() {
  await fs.writeFile(REFRESH_FLAG, 'ok\n');
}

// 🧹 Cleanup flag manually
async function clearYarnRefreshFlag() {
  if (existsSync(REFRESH_FLAG)) {
    await safeUnlink(REFRESH_FLAG);
    console.log('🧹 Yarn refresh flag cleared. Ready for next cycle.');
    process.exit(0);
  }
}

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

// 🔁 Refresh Yarn using spawn for signal-safe handling
function refreshYarn() {
  return new Promise((resolve, reject) => {
    console.log('🔁 Refreshing Yarn (force reinstall)...');

    const child = spawn('yarn', ['install', '--force'], {
      stdio: 'inherit',
      shell: true,
    });

    const handleSignal = (signal) => {
      console.log(`\n🛑 Received ${signal}, forwarding to Yarn...`);
      child.kill(signal);
    };

    process.on('SIGINT', handleSignal);
    process.on('SIGTERM', handleSignal);

    child.on('exit', async (code) => {
      process.off('SIGINT', handleSignal);
      process.off('SIGTERM', handleSignal);

      if (code === 0) {
        console.log('✅ Yarn refresh complete.');
        resolve();
      } else {
        console.warn(`⚠️ Yarn refresh failed with exit code ${code}`);
        await safeUnlink(REFRESH_FLAG);
        reject(new Error(`yarn exited with code ${code}`));
      }
    });

    child.on('error', async (err) => {
      console.error('❌ Failed to start Yarn:', err.message);
      await safeUnlink(REFRESH_FLAG);
      reject(err);
    });
  });
}

// 🔁 Main logic
(async () => {
  await clearYarnRefreshFlag(); // Always clear stale flag first

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
    try {
      await refreshYarn();
      process.exit(0);
    } catch {
      process.exit(1);
    }
  }
})();
