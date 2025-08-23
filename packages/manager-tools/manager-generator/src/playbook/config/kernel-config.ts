/**
 * Prefix markers used in prompt selections (e.g. "v2-/iam").
 */
export const v2Prefix = 'v2-';
export const v6Prefix = 'v6-';

/**
 * Swagger/OpenAPI JSON base endpoints.
 * Keep both to allow future divergence, even if they currently point to the same host.
 * Override with env if you need to target a different region during development.
 */
export const v2Endpoint = 'https://eu.api.ovh.com/v2';
export const v6Endpoint = 'https://api.ovh.com/1.0';

/**
 * List of common binary file extensions handled as non-text assets.
 *
 * These extensions are used when copying or processing files to determine
 * whether the file content should be treated as binary rather than UTF-8 text.
 *
 * Typical usage:
 * - Skipping token replacement for binary assets
 * - Preserving file encoding when copying
 * - Avoiding line ending normalization
 *
 * @constant
 * @type {string[]}
 *
 * @example
 * ```ts
 * if (DEFAULT_BINARY_EXTS.includes(path.extname(filePath))) {
 *   // Handle as binary
 * }
 * ```
 */
export const DEFAULT_BINARY_EXTS = [
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.ico',
  '.pdf',
  '.zip',
  '.gz',
  '.tar',
  '.tgz',
  '.woff',
  '.woff2',
];
