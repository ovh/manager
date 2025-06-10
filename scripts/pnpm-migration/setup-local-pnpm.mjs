#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import os from 'os';
import path from 'path';

const version = '10.11.1';
const targetDir = path.resolve('./target/pnpm');
const pnpmPath = path.join(targetDir, 'pnpm');

function installPnpm() {
  console.log(`⬇️ Installing PNPM v${version} locally...`);

  mkdirSync(targetDir, { recursive: true });

  const platform = os.platform();
  let installScript;

  if (platform === 'win32') {
    installScript =
      `powershell -Command "Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression"`;
  } else {
    // Set SHELL explicitly to satisfy install.sh in CI (like GitHub Actions)
    const shell = '/bin/bash';
    installScript =
      `curl -fsSL https://get.pnpm.io/install.sh | env SHELL=${shell} PNPM_VERSION=${version} PNPM_HOME=${targetDir} sh -`;
  }

  try {
    execSync(installScript, { stdio: 'inherit' });
    console.log(`✅ PNPM v${version} installed in ${targetDir}`);
  } catch (error) {
    console.error('❌ Failed to install PNPM:', error.message);
    process.exit(1);
  }
}

function verifyInstall() {
  const expectedBinary = path.join(targetDir, 'pnpm');
  if (existsSync(expectedBinary)) {
    console.log(`✔ pnpm is available at ${expectedBinary}`);
  } else {
    console.warn(`⚠ pnpm was not found at ${expectedBinary}`);
  }
}

if (!existsSync(pnpmPath)) {
  installPnpm();
  verifyInstall();
} else {
  console.log('✔ pnpm is already installed locally.');
  verifyInstall();
}
