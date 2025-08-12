/**
 * @file paths-utils.ts
 * @description Path normalization utilities for API endpoints and derived keys.
 */

/**
 * Ensure a path starts with a single leading slash and has no trailing spaces.
 *
 * @param {string} input - A user-provided or computed path.
 * @returns {string} A normalized path starting with "/".
 *
 * @example
 * ensureLeadingSlash('me')           // "/me"
 * ensureLeadingSlash('/cloud/project') // "/cloud/project"
 */
export function ensureLeadingSlash(input: string): string {
  const s = String(input ?? '').trim();
  if (!s) return '/';
  return s.startsWith('/') ? s : `/${s}`;
}

/**
 * Validate that a path starts with a slash (throwing a friendly error if not).
 * Use when you want to enforce correctness at schema/edge boundaries.
 *
 * @param {string} input - Path to validate.
 * @throws {Error} When path does not start with "/".
 *
 * @example
 * assertStartsWithSlash('/ok'); // ok
 * assertStartsWithSlash('bad'); // throws
 */
export function assertStartsWithSlash(input: string): void {
  if (typeof input !== 'string' || !input.startsWith('/')) {
    throw new Error('Path must start with "/"');
  }
}

/**
 * Strip a version prefix of the form "v<digit>-/" that some inputs may include
 * (e.g., "v6-/ovhCloudConnect" → "/ovhCloudConnect").
 *
 * Only strips *one* leading "vN-/" occurrence; leaves other content intact.
 *
 * @param {string} input - A path that may start with "v6-/" or similar.
 * @returns {string} Path without the leading version prefix.
 *
 * @example
 * stripApiVersionPrefix('v6-/ovhCloudConnect') // "/ovhCloudConnect"
 * stripApiVersionPrefix('/v2/users')           // "/v2/users" (unchanged)
 */
export function stripApiVersionPrefix(input: string): string {
  const s = String(input ?? '');
  return s.replace(/^v\d+-\//, '/');
}

/**
 * Brace-aware “base path” extraction.
 * If a segment contains a parameter like "{id}" followed by a suffix
 * (e.g., "/{id}-getProject"), this function keeps everything up to the "}"
 * and discards the suffix. If there is no "}", input is returned unchanged.
 *
 * @param {string} input - A potentially combined endpoint.
 * @returns {string} The base path up to the first closing brace (inclusive), if any.
 *
 * @example
 * braceAwareBasePath('/cloud/project/{serviceName}-getProject')
 * // → '/cloud/project/{serviceName}'
 *
 * braceAwareBasePath('/v2/users/list')
 * // → '/v2/users/list' (unchanged)
 */
export function braceAwareBasePath(input: string): string {
  const s = String(input ?? '');
  const idx = s.indexOf('}');
  return idx >= 0 ? s.slice(0, idx + 1) : s;
}

/**
 * Convert a path to a schema-safe key (e.g., for map/object lookups).
 * Removes leading slash, replaces "/" with "__", and removes "{}".
 * Keep conservative to avoid collisions; adjust to your schema strategy if needed.
 *
 * @param {string} input - A path like "/cloud/project/{serviceName}".
 * @returns {string} A schema-safe string like "cloud__project__serviceName".
 *
 * @example
 * sanitizePathForSchema('/cloud/project/{serviceName}')
 * // → "cloud__project__serviceName"
 */
export function sanitizePathForSchema(input: string): string {
  return String(input ?? '')
    .replace(/^\//, '') // drop one leading slash
    .replace(/[{}]/g, '') // drop braces
    .replace(/\/+/g, '__') // slashes → double underscore (reduce collision risk)
    .trim();
}

/**
 * Split a normalized path into segments (without leading empty segment).
 * Leading "/" is ignored; multiple slashes are collapsed by default.
 *
 * @param {string} input - A path like "/cloud/project/{serviceName}".
 * @returns {string[]} Segments, e.g., ["cloud", "project", "{serviceName}"].
 *
 * @example
 * pathSegments('/a/b/{id}') // ["a","b","{id}"]
 */
export function pathSegments(input: string): string[] {
  return String(input ?? '')
    .replace(/^\/+/, '')
    .split('/')
    .filter(Boolean);
}

/**
 * Normalize a path for downstream processing:
 * - Ensure leading slash
 * - Strip "vN-/" prefix if present
 * - Optionally apply brace-aware cut
 *
 * @param {string} input - The original path.
 * @param {object} [opts]
 * @param {boolean} [opts.braceAware] - When true, trims any suffix after the first "}".
 * @returns {string} The normalized path.
 *
 * @example
 * normalizePath('v6-/ovhCloudConnect') // "/ovhCloudConnect"
 * normalizePath('/cloud/project/{serviceName}-getProject', { braceAware: true })
 * // "/cloud/project/{serviceName}"
 */
export function normalizePath(input: string, opts?: { braceAware?: boolean }): string {
  const withSlash = ensureLeadingSlash(input);
  const stripped = stripApiVersionPrefix(withSlash);
  return opts?.braceAware ? braceAwareBasePath(stripped) : stripped;
}
