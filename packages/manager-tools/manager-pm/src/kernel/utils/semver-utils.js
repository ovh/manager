import { spawnSync } from 'node:child_process';
import semver from 'semver';

/**
 * Extract a semver version from arbitrary text output.
 * Uses semver.coerce to accept formats like "Nx Version: 22.3.3".
 *
 * @param {string} text
 * @returns {string|null} e.g. "22.3.3"
 */
export function extractVersion(text) {
  const coerced = semver.coerce(String(text ?? ''));
  return coerced?.version ?? null;
}

/**
 * Run `<binary> --version` and parse the version.
 *
 * @param {string} binaryPath
 * @returns {string|null}
 */
export function readBinaryVersion(binaryPath) {
  const result = spawnSync(binaryPath, ['--version'], { encoding: 'utf8' });
  const output = `${result.stdout || ''}\n${result.stderr || ''}`.trim();
  return extractVersion(output);
}

/**
 * Validate a resolved Nx version against a minimum required version.
 *
 * @param {string|null} version
 * @param {string} minimumVersion
 * @returns {boolean}
 */
export function isVersionSupported(version, minimumVersion) {
  if (!version) return false;
  return semver.gte(version, minimumVersion);
}
