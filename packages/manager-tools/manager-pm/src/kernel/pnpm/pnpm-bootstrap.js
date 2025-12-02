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
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import os from 'node:os';
import process from 'node:process';

import {
  pnpmBinaryPath,
  pnpmExecutablePath,
  pnpmVersion,
  rootPackageJsonPath,
} from '../../playbook/playbook-config.js';
import { logger } from '../utils/log-manager.js';
import { removePackageManager, restorePackageManager } from '../utils/package-manager-utils.js';

/**
 * Compute the final PNPM executable path for the current platform.
 * On Windows, appends `.exe`.
 *
 * @param {string} platform - Node.js platform string (e.g. "linux", "darwin", "win32")
 * @returns {string} Absolute path to the PNPM binary executable
 */
export function getPnpmPlatformExecutablePath(platform) {
  return pnpmExecutablePath + (platform === 'win32' ? '.exe' : '');
}

/**
 * Resolve the PNPM release binary filename for the given platform/arch.
 *
 * @param {string} platform - NodeJS platform (darwin, linux, win32, etc.)
 * @param {string} arch - NodeJS architecture (x64, arm64, etc.)
 * @throws If platform/arch combination is unsupported
 */
function getReleaseBinaryName(platform, arch) {
  logger.info(`🔍 Resolving PNPM binary for platform=${platform}, arch=${arch}`);
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
function installPnpmBinary() {
  logger.info(`🚀 Installing PNPM v${pnpmVersion} binary...`);
  mkdirSync(pnpmBinaryPath, { recursive: true });
  logger.debug(`📂 Ensured directory exists: ${pnpmBinaryPath}`);

  const platform = os.platform();
  const arch = os.arch();

  let binaryName;
  try {
    binaryName = getReleaseBinaryName(platform, arch);
    logger.success(`✔ Binary resolved: ${binaryName}`);
  } catch (e) {
    logger.error(`❌ ${e instanceof Error ? e.message : e}`);
    process.exit(1);
  }

  const pnpmBinaryUrl = `https://github.com/pnpm/pnpm/releases/download/v${pnpmVersion}/${binaryName}`;
  const outputPath = getPnpmPlatformExecutablePath(platform);

  logger.info(`🌐 Downloading PNPM binary from: ${pnpmBinaryUrl}`);
  logger.info(`📦 Saving to: ${outputPath}`);

  try {
    execSync(`curl -fsSL "${pnpmBinaryUrl}" -o "${outputPath}"`, { stdio: 'inherit' });
    logger.success(`✔ Downloaded PNPM binary to ${outputPath}`);

    if (platform !== 'win32') {
      logger.info('🔑 Making binary executable...');
      execSync(`chmod +x "${outputPath}"`, { stdio: 'inherit' });
      logger.success(`✔ Permissions updated for ${outputPath}`);
    }
  } catch (err) {
    logger.error(
      `❌ Failed to download/setup PNPM binary: ${err instanceof Error ? err.message : err}`,
    );
    logger.debug(`Stack trace: ${err.stack}`);
    process.exit(1);
  }
}

/**
 * Ensure pnpm exists locally and is usable. Installs it if missing.
 *
 * Handles removal/restoration of the root packageManager field
 * so that Yarn does not interfere with pnpm execution.
 */
export async function bootstrapPnpm() {
  logger.info('⚡ Bootstrapping PNPM...');
  const executablePath = getPnpmPlatformExecutablePath(os.platform());

  if (!existsSync(executablePath)) {
    logger.warn(`⚠ PNPM not found at ${executablePath}`);
    installPnpmBinary();
  } else {
    logger.success(`✔ PNPM binary already exists at ${executablePath}`);
  }

  // --- Temporarily remove packageManager
  const removedValue = await removePackageManager(rootPackageJsonPath);

  logger.info('🔎 Verifying PNPM binary with --version...');
  try {
    execSync(`${executablePath} --version`, { stdio: 'inherit' });
    logger.success(`✅ PNPM binary is working at ${executablePath}`);
  } catch (err) {
    logger.error(
      `❌ PNPM binary not working after install: ${err instanceof Error ? err.message : err}`,
    );
    logger.debug(`Stack trace: ${err.stack}`);
    process.exit(1);
  } finally {
    // --- Always restore packageManager field
    await restorePackageManager(rootPackageJsonPath, removedValue);
  }

  logger.info('🎉 PNPM bootstrap complete!');
}
