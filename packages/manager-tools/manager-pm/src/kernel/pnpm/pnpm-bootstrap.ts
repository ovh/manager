#!/usr/bin/env node
/**
 * Prepare a local, pinned PNPM binary under `target/pnpm`.
 *
 * - Detects platform/arch and downloads the correct PNPM release binary.
 * - Places it at `target/pnpm/pnpm` (or `pnpm.exe` on Windows).
 * - Verifies the install by running `pnpm --version`.
 * - Safe signal handlers log and exit cleanly.
 */
import { consola } from 'consola';
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import os from 'node:os';

import { pnpmBinaryPath, pnpmExecutablePath, pnpmVersion } from '../../playbook/pnpm-config.js';

/**
 * Compute the final executable path for pnpm based on the current platform.
 */
function getPnpmExecutablePath(platform: NodeJS.Platform): string {
  return pnpmExecutablePath + (platform === 'win32' ? '.exe' : '');
}

/**
 * Resolve the PNPM release binary filename for the given platform/arch.
 */
function getReleaseBinaryName(platform: NodeJS.Platform, arch: NodeJS.Architecture): string {
  consola.info(`🔍 Resolving binary for platform=${platform}, arch=${arch}`);
  if (platform === 'darwin') {
    return arch === 'arm64' ? 'pnpm-macos-arm64' : 'pnpm-macos-x64';
  }
  if (platform === 'linux') {
    return arch === 'arm64' ? 'pnpm-linux-arm64' : 'pnpm-linux-x64';
  }
  if (platform === 'win32') {
    return 'pnpm-win.exe';
  }
  throw new Error(`Unsupported platform: ${platform}-${arch}`);
}

/**
 * Download the PNPM release binary into pnpmBinaryPath and make it executable (non-Windows).
 */
function installPnpmBinary(): void {
  consola.start(`🚀 Installing PNPM v${pnpmVersion} binary...`);
  mkdirSync(pnpmBinaryPath, { recursive: true });
  consola.info(`📂 Ensured directory exists: ${pnpmBinaryPath}`);

  const platform = os.platform();
  const arch = os.arch();

  let binaryName: string;
  try {
    binaryName = getReleaseBinaryName(platform, arch as NodeJS.Architecture);
    consola.success(`✔ Binary resolved: ${binaryName}`);
  } catch (e) {
    consola.error(`${e instanceof Error ? e.message : String(e)}`);
    process.exit(1);
  }

  const pnpmBinaryUrl = `https://github.com/pnpm/pnpm/releases/download/v${pnpmVersion}/${binaryName}`;
  const outputPath = getPnpmExecutablePath(platform);

  consola.info(`🌐 Downloading from: ${pnpmBinaryUrl}`);
  consola.info(`📦 Output path: ${outputPath}`);

  try {
    execSync(`curl -fsSL "${pnpmBinaryUrl}" -o "${outputPath}"`, { stdio: 'inherit' });
    consola.success(`✔ Downloaded PNPM binary to ${outputPath}`);

    if (platform !== 'win32') {
      consola.info('🔑 Making binary executable...');
      execSync(`chmod +x "${outputPath}"`, { stdio: 'inherit' });
      consola.success(`✔ Permissions updated for ${outputPath}`);
    }
  } catch (err) {
    if (err instanceof Error) {
      consola.error('❌ Failed to download PNPM binary:', err.message);
    } else {
      consola.error('❌ Failed to download PNPM binary.');
    }
    process.exit(1);
  }
}

/**
 * Ensure pnpm exists locally and is usable. Installs it if missing.
 */
export function bootstrapPnpm(): void {
  consola.start('⚡ Bootstrapping PNPM...');
  const executablePath = getPnpmExecutablePath(os.platform());

  if (!existsSync(executablePath)) {
    consola.warn(`⚠ PNPM not found at ${executablePath}`);
    installPnpmBinary();
  } else {
    consola.success(`✔ PNPM binary already exists at ${executablePath}`);
  }

  consola.info('🔎 Verifying PNPM binary with --version...');
  try {
    execSync(`${executablePath} --version`, { stdio: 'inherit' });
    consola.success(`✅ PNPM binary is working from ${executablePath}`);
  } catch {
    consola.error('❌ PNPM binary not working after install.');
    process.exit(1);
  }

  consola.box('🎉 PNPM bootstrap complete!');
}
