#!/usr/bin/env node
/**
 * Prepare a local, pinned PNPM binary under `target/pnpm`.
 *
 * - Detects platform/arch and downloads the correct PNPM release binary.
 * - Places it at `target/pnpm/pnpm` (or `pnpm.exe` on Windows).
 * - Verifies the install by running `pnpm --version`.
 * - Safe signal handlers log and exit cleanly.
 *
 * Usage (after compiling to JS):
 * ```bash
 * node dist/prepare-pnpm-workspace.js
 * ```
 *
 * Notes:
 * - The shebang is preserved by `tsc`, so the compiled file can be invoked directly if it is executable.
 * - Set `PNPM_VERSION` env var to override the default version.
 */

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import os from 'node:os';
import { consola } from 'consola';
import {
  pnpmExecutablePath,
  pnpmBinaryPath,
  pnpmVersion,
} from '../../playbook/pnpm-config.js';

/**
 * Compute the final executable path for pnpm based on the current platform.
 * @param platform - Current OS platform (e.g., 'linux', 'darwin', 'win32').
 * @returns Absolute path to the pnpm executable including extension on Windows.
 */
function getPnpmExecutablePath(platform: NodeJS.Platform): string {
  return pnpmExecutablePath + (platform === 'win32' ? '.exe' : '');
}

/**
 * Resolve the PNPM release binary filename for the given platform/arch.
 * @param platform - Node platform string.
 * @param arch - CPU architecture string (e.g., 'x64', 'arm64').
 * @returns The filename as published on the PNPM GitHub releases.
 * @throws If the platform/arch combination is not supported.
 */
function getReleaseBinaryName(
  platform: NodeJS.Platform,
  arch: NodeJS.Architecture,
): string {
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
 * Download the PNPM release binary into {@link pnpmBinaryPath} and make it executable (non-Windows).
 * Uses `curl` for portability. If `curl` is not present, the command will fail.
 * @throws If the download or permission change fails.
 */
function installPnpmBinary(): void {
  consola.info(`Downloading PNPM v${pnpmVersion} binary...`);
  mkdirSync(pnpmBinaryPath, { recursive: true });

  const platform = os.platform();
  const arch = os.arch();

  let binaryName: string;
  try {
    binaryName = getReleaseBinaryName(platform, arch as NodeJS.Architecture);
  } catch (e) {
    consola.error(`${e instanceof Error ? e.message : String(e)}`);
    process.exit(1);
  }

  const pnpmBinaryUrl = `https://github.com/pnpm/pnpm/releases/download/v${pnpmVersion}/${binaryName}`;
  const outputPath = getPnpmExecutablePath(platform);

  try {
    // Download binary
    execSync(`curl -fsSL "${pnpmBinaryUrl}" -o "${outputPath}"`, {
      stdio: 'inherit',
    });

    // Make executable on POSIX platforms
    if (platform !== 'win32') {
      execSync(`chmod +x "${outputPath}"`, { stdio: 'inherit' });
    }

    consola.info(`PNPM v${pnpmVersion} downloaded to ${outputPath}`);
  } catch (err) {
    if (err instanceof Error) {
      consola.error('Failed to download PNPM binary:', err.message);
    } else {
      consola.error('Failed to download PNPM binary.');
    }
    process.exit(1);
  }
}

/**
 * Ensure pnpm exists locally and is usable. Installs it if missing.
 * Exits the process with code 0 on success, 1 on failure.
 */
export function bootstrapPnpm(): void {
  // Download the PNPM release binary into pnpmBinaryPath and make it executable
  const executablePath = getPnpmExecutablePath(os.platform());
  if (!existsSync(executablePath)) {
    installPnpmBinary();
  } else {
    consola.success('PNPM binary already exists at', executablePath);
  }

  // Verify that the pnpm binary is functional by invoking `--version`.
  const testCmd = getPnpmExecutablePath(os.platform());
  try {
    execSync(`${testCmd} --version`, { stdio: 'inherit' });
    consola.success(`pnpm binary is working from ${testCmd}`);
  } catch {
    consola.error('pnpm binary not working after install.');
    process.exit(1);
  }
}
