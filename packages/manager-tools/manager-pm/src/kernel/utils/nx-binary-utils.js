import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { managerRootPath } from '../../playbook/playbook-config.js';
import { isFileExists } from './file-utils.js';
import { logger } from './log-manager.js';
import { extractVersion, isVersionSupported, readBinaryVersion } from './semver-utils.js';

/**
 * @typedef {Object} NxResolutionResult
 * @property {string|null} binaryPath - Absolute path to the Nx binary, or null if not found.
 * @property {string|null} version - Resolved Nx version, or null if unknown.
 * @property {'local'|'global'|'none'} source - Where Nx was found.
 */

/**
 * Return the Nx binary filename for the current platform.
 * @returns {string}
 */
function getNxBinaryFileName() {
  return process.platform === 'win32' ? 'nx.cmd' : 'nx';
}

/**
 * Read Nx version from local node_modules package.json (most reliable for local installs).
 *
 * @param {string} workspaceRoot
 * @returns {Promise<string|null>}
 */
async function readLocalNxPackageVersion(workspaceRoot) {
  const nxPackageJsonPath = path.join(workspaceRoot, 'node_modules', 'nx', 'package.json');
  if (!(await isFileExists(nxPackageJsonPath))) return null;

  try {
    const raw = await fs.readFile(nxPackageJsonPath, 'utf8');
    const pkg = JSON.parse(raw);
    return extractVersion(pkg.version);
  } catch {
    return null;
  }
}

/**
 * Resolve local Nx binary from node_modules/.bin.
 *
 * @param {string} workspaceRoot
 * @returns {Promise<string|null>}
 */
async function resolveLocalNxBinary(workspaceRoot) {
  const localBinaryPath = path.join(workspaceRoot, 'node_modules', '.bin', getNxBinaryFileName());
  return (await isFileExists(localBinaryPath)) ? localBinaryPath : null;
}

/**
 * Resolve candidate global Nx binaries.
 * - Prefers /usr/bin/nx on Unix-like systems (APT install)
 * - Also tries PATH lookup (command -v / where)
 *
 * @returns {string[]} List of candidate absolute paths or command-resolved paths
 */
function resolveGlobalNxCandidates() {
  /** @type {string[]} */
  const candidates = [];

  // Common path for Nx installed via APT on Linux
  if (process.platform !== 'win32') {
    candidates.push('/usr/bin/nx');
  }

  // PATH lookup without relying on env vars in your app logic (we just ask the OS).
  try {
    if (process.platform === 'win32') {
      const whereResult = spawnSync('where', ['nx'], { encoding: 'utf8' });
      const firstHit = (whereResult.stdout || '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)[0];
      if (firstHit) candidates.push(firstHit);
    } else {
      const whichResult = spawnSync('sh', ['-lc', 'command -v nx'], { encoding: 'utf8' });
      const resolvedPath = (whichResult.stdout || '').trim();
      if (resolvedPath) candidates.push(resolvedPath);
    }
  } catch {
    // ignore resolution failures
  }

  // de-dupe while preserving order
  return [...new Set(candidates.filter(Boolean))];
}

/**
 * Resolve Nx binary with priority:
 *   1) local node_modules Nx (must be >= minimumVersion)
 *   2) global Nx (APT/PATH) (must be >= minimumVersion)
 *   3) none
 *
 * @param {{ minimumVersion: string, workspaceRoot?: string }} params
 * @returns {Promise<NxResolutionResult>}
 */
export async function resolveNxBinary({ minimumVersion, workspaceRoot = managerRootPath }) {
  // 1) Local Nx
  const localBinaryPath = await resolveLocalNxBinary(workspaceRoot);
  if (localBinaryPath) {
    const localPackageVersion = await readLocalNxPackageVersion(workspaceRoot);
    const localBinaryVersion = readBinaryVersion(localBinaryPath);
    const resolvedLocalVersion = localPackageVersion || localBinaryVersion;

    if (isVersionSupported(resolvedLocalVersion, minimumVersion)) {
      return { binaryPath: localBinaryPath, version: resolvedLocalVersion, source: 'local' };
    }

    logger.warn(
      `[runner:nx] Local Nx found but unsupported (found=${resolvedLocalVersion ?? 'unknown'} < ${minimumVersion}).`,
    );
  }

  // 2) Global Nx
  for (const candidatePath of resolveGlobalNxCandidates()) {
    const candidateVersion = readBinaryVersion(candidatePath);
    if (isVersionSupported(candidateVersion, minimumVersion)) {
      return { binaryPath: candidatePath, version: candidateVersion, source: 'global' };
    }
  }

  // 3) Not found
  return { binaryPath: null, version: null, source: 'none' };
}
