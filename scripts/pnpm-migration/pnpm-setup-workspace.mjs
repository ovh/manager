#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync, mkdirSync, promises as fs } from 'fs';
import os from 'os';
import path from 'path';

const version = '10.11.1';
const targetDir = path.resolve('./target/pnpm');
const pnpmPath = path.join(targetDir, 'pnpm');
const CLEAN_ROOT = path.resolve('./packages');
const FOLDERS_TO_REMOVE = new Set(['target', 'dist', '.turbo']);

const args = process.argv.slice(2);
const shouldClean = args.includes('--clean');

// 🔹 Step 1: Clean legacy folders (excluding node_modules)
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

async function cleanWorkspace() {
  console.log('🧹 Cleaning matching folders in root and inside packages/...');

  // Clean from root
  await findAndRemoveDirs(path.resolve('.'));

  // Clean inside CLEAN_ROOT
  await findAndRemoveDirs(CLEAN_ROOT);

  console.log('✅ Workspace clean complete.');
}

// 🔹 Step 2: Install PNPM locally (isolated inside target/)
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

// 🔹 Step 3: Ensure PNPM is functional
function verifyInstall() {
  if (existsSync(pnpmPath)) {
    console.log(`✔ pnpm is available at ${pnpmPath}`);
  } else {
    console.error(`❌ pnpm not found at ${pnpmPath} after install.`);
    process.exit(1);
  }
}

// 🔁 Main
(async () => {
  if (shouldClean) {
    await cleanWorkspace();
  } else {
    console.log('ℹ️ Skipping workspace cleaning (use --clean to enable it).');
  }

  if (!existsSync(pnpmPath)) {
    installPnpm();
  } else {
    console.log('✔ pnpm is already installed locally.');
  }

  verifyInstall();
})();
