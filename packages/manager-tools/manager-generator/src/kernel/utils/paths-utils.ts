/**
 * @file paths-utils.ts
 * @description Path normalization utilities for API endpoints and derived keys.
 */
import { ApiPathChoice } from '../types/api-types';
import { PromptChoice, VersionSplit } from '../types/inquiries-types';
import { isNameValue, isSeparatorLike } from './naming-utils';

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
  // handle "v2-/x" and "/v2-/x"
  return s.replace(/^\/?v\d+-\//, '/');
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
  // Strip the transport prefix *first*, then ensure leading slash.
  const stripped = stripApiVersionPrefix(input);
  const withSlash = ensureLeadingSlash(stripped);
  return opts?.braceAware ? braceAwareBasePath(withSlash) : withSlash;
}

/**
 * Normalize a selected endpoint value to its base API path and detect API version.
 *
 * The generator’s endpoint chooser encodes values as:
 *   `${apiPath}-${functionName}`
 *
 * Examples:
 *  - "/v2/users/list-getUsers" → base="/v2/users/list", version="v2"
 *  - "/cloud/project/{serviceName}-getProject" → base="/cloud/project/{serviceName}", version="v6"
 *
 * Notes:
 *  - We split on the **last** '-' to allow hyphens elsewhere (defensive).
 *  - We normalize the base using `normalizePath(..., { braceAware: true })`
 *    so that combined forms like "/x/{id}-getThing" become "/x/{id}".
 *
 * @param value The raw selected value from the prompt (e.g., "/path-fnName").
 * @returns `{ version: 'v2' | 'v6', base: string }`
 */
export function normalizeSelectedApiPath(value: string): { version: 'v2' | 'v6'; base: string } {
  const raw = String(value ?? '');
  const lastDash = raw.lastIndexOf('-');

  let pathPart = raw;
  if (lastDash > 0) {
    const tail = raw.slice(lastDash + 1);
    // Only split if tail looks like a function name (no slashes)
    if (tail && !tail.includes('/')) {
      pathPart = raw.slice(0, lastDash);
    }
  }

  // This will now correctly turn "v2-/x" into "/x"
  const base = normalizePath(pathPart, { braceAware: true });

  // Heuristic: v2 if base starts with "/v2" OR raw starts with the transport prefix "v2-/"
  const version: 'v2' | 'v6' = base.startsWith('/v2') || raw.startsWith('v2-/') ? 'v2' : 'v6';

  return { version, base };
}

/**
 * Split selected API base paths into v2 / v6 buckets.
 * Uses normalizeSelectedApiPath, then brace-aware normalization for consistent matching.
 */
export function splitApiPathsByVersion(paths: string[]): VersionSplit {
  const out: VersionSplit = { v2: [], v6: [] };
  const seen = { v2: new Set<string>(), v6: new Set<string>() };

  for (const p of paths) {
    const { version, base } = normalizeSelectedApiPath(p);
    const normBase = normalizePath(base, { braceAware: true });
    if (!seen[version].has(normBase)) {
      seen[version].add(normBase);
      out[version].push(normBase);
    }
  }
  return out;
}

/**
 * Normalize API path choices (which may include strings or separators)
 * into a uniform {@link PromptChoice[]} array.
 *
 * - Strings → `{ name, value }`
 * - `{ name, value }` pairs → preserved
 * - Separators → `{ name, disabled: true }`
 * - Unknown → stringified
 *
 * @param items Array of API path choices
 * @returns Normalized prompt choices
 */
export function normalizeApiPathChoices(items: ApiPathChoice[]): PromptChoice[] {
  return items.map((it) => {
    if (typeof it === 'string') {
      return { name: it, value: it };
    }
    if (isNameValue(it)) {
      return { name: String(it.name), value: String(it.value) };
    }
    if (isSeparatorLike(it)) {
      return { name: it.line ?? '—', disabled: true };
    }
    const safe = JSON.stringify(it);
    return { name: safe, value: safe };
  });
}
