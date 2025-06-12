#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync, mkdirSync, promises as fs } from 'fs';
import os from 'os';
import path from 'path';

const version = '10.11.1';
const targetDir = path.resolve('./target/pnpm');
const pnpmPath = path.join(targetDir, 'pnpm');
const CLEAN_ROOT = path.resolve('./packages');

// 🔹 Clean folders
async function findAndRemoveDirs(root, dirNames = new Set(['node_modules', 'dist', '.turbo'])) {
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

async function cleanWorkspace() {
  const rootNodeModules = path.resolve('./node_modules');

  if (existsSync(rootNodeModules)) {
    console.log(`🧹 Removing root ${rootNodeModules}`);
    await fs.rm(rootNodeModules, { recursive: true, force: true });
  }

  console.log('🧹 Cleaning node_modules, dist, and .turbo folders inside packages/...');
  await findAndRemoveDirs(CLEAN_ROOT);
  console.log('✅ Clean complete.');
}

// 🔹 Install PNPM CLI
function installPnpm() {
  console.log(`⬇️ Installing PNPM v${version} locally...`);
  mkdirSync(targetDir, { recursive: true });

  const platform = os.platform();
  const shell = platform === 'win32' ? 'powershell' : '/bin/bash';
  const installScript = platform === 'win32'
    ? `powershell -Command "Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression"`
    : `curl -fsSL https://get.pnpm.io/install.sh | env SHELL=${shell} PNPM_VERSION=${version} PNPM_HOME=${targetDir} sh -`;

  try {
    execSync(installScript, { stdio: 'inherit' });
    console.log(`✅ PNPM v${version} installed in ${targetDir}`);
  } catch (err) {
    console.error('❌ Failed to install PNPM:', err.message);
    process.exit(1);
  }
}

function verifyInstall() {
  if (existsSync(pnpmPath)) {
    console.log(`✔ pnpm is available at ${pnpmPath}`);
  } else {
    console.warn(`⚠ pnpm was not found at ${pnpmPath}`);
    process.exit(1);
  }
}

// 🔁 Run setup (yarn install --rebuild or yarn install)
(async () => {
  await cleanWorkspace();

  if (!existsSync(pnpmPath)) {
    installPnpm();
  } else {
    console.log('✔ pnpm is already installed locally.');
  }

  // verify that pnpm was correctly installed else exit
  verifyInstall();
})();
