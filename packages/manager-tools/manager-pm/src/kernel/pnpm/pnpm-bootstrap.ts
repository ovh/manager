#!/usr/bin/env node
/**
 * Prepare a local, pinned PNPM binary under `target/pnpm`.
 *
 * Steps:
 *  1. Compute the correct binary name based on platform/arch.
 *  2. Download the PNPM release binary from GitHub.
 *  3. Store it in `target/pnpm/pnpm` (or `pnpm.exe` on Windows).
 *  4. Make it executable (non-Windows).
 *  5. Verify with `pnpm --version`.
 *  6. Handle errors gracefully with clear logs.
 */
import { consola } from 'consola';
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import os from 'node:os';

import {
  pnpmBinaryPath,
  pnpmExecutablePath,
  pnpmVersion,
  rootPackageJsonPath,
} from '../../playbook/pnpm-config.js';
import { removePackageManager, restorePackageManager } from '../commons/package-manager-utils.js';

/**
 * Compute the final executable path for pnpm based on the current platform.
 *
 * @param platform - NodeJS platform
 * @returns Executable path string
 */
function getPnpmExecutablePath(platform: NodeJS.Platform): string {
  return pnpmExecutablePath + (platform === 'win32' ? '.exe' : '');
}

/**
 * Resolve the PNPM release binary filename for the given platform/arch.
 *
 * @param platform - NodeJS platform (darwin, linux, win32, etc.)
 * @param arch - NodeJS architecture (x64, arm64, etc.)
 * @throws If platform/arch combination is unsupported
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
 * Download and install the PNPM release binary into pnpmBinaryPath.
 *
 * @throws If download or chmod fails
 */
function installPnpmBinary(): void {
  consola.start(`🚀 Installing PNPM v${pnpmVersion} binary...`);
  mkdirSync(pnpmBinaryPath, { recursive: true });
  consola.info(`📂 Ensured directory exists: ${pnpmBinaryPath}`);

  const platform = os.platform();
  const arch = os.arch();

  let binaryName: string;
  try {
    binaryName = getReleaseBinaryName(platform, arch);
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
    consola.error(
      '❌ Failed to download or setup PNPM binary:',
      err instanceof Error ? err.message : String(err),
    );
    process.exit(1);
  }
}

/**
 * Ensure pnpm exists locally and is usable. Installs it if missing.
 *
 * Handles removal/restoration of the root packageManager field
 * so that Yarn does not interfere with pnpm execution.
 */
/**
 * Ensure pnpm exists locally and is usable. Installs it if missing.
 *
 * Handles removal/restoration of the root packageManager field
 * so that Yarn does not interfere with pnpm execution.
 */
export async function bootstrapPnpm(): Promise<void> {
  consola.start('⚡ Bootstrapping PNPM...');
  const executablePath = getPnpmExecutablePath(os.platform());

  if (!existsSync(executablePath)) {
    consola.warn(`⚠ PNPM not found at ${executablePath}`);
    installPnpmBinary();
  } else {
    consola.success(`✔ PNPM binary already exists at ${executablePath}`);
  }

  // --- Temporarily remove packageManager
  const removedValue = await removePackageManager(rootPackageJsonPath);

  consola.info('🔎 Verifying PNPM binary with --version...');
  try {
    execSync(`${executablePath} --version`, { stdio: 'inherit' });
    consola.success(`✅ PNPM binary is working from ${executablePath}`);
  } catch (err) {
    consola.error(
      '❌ PNPM binary not working after install:',
      err instanceof Error ? err.message : String(err),
    );
    process.exit(1);
  } finally {
    // --- Always restore packageManager field
    await restorePackageManager(rootPackageJsonPath, removedValue);
  }

  consola.box('🎉 PNPM bootstrap complete!');
}
