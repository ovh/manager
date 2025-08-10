import { v2Prefix, v6Prefix } from '../config/kernel-constants';
import { ServiceOperations } from '../types/api-types';

/** True if the value starts with the v2 prompt prefix. */
export const isV2Endpoint = (apiPath: string): boolean => apiPath.startsWith(v2Prefix);

/** True if the value starts with the v6 prompt prefix. */
export const isV6Endpoint = (apiPath: string): boolean => apiPath.startsWith(v6Prefix);

/**
 * Normalize a raw API path string from the generator UI into a structured form.
 *
 * Accepts legacy UI values like `"v2-/location"` or `"v6-/services"`, extracts:
 * - `version`: `'v2'` or `'v6'` (falls back to heuristics if no match)
 * - `base`: normalized path string starting with `/` and without the version prefix
 *
 * @example
 * normalizeSelectedApiPath("v2-/location")
 * // => { version: "v2", base: "/location" }
 *
 * @param {string} raw - Raw API path string from UI selection.
 * @returns {{ version: 'v2' | 'v6'; base: string }} Extracted API version and normalized base path.
 */
export function normalizeSelectedApiPath(raw: string): { version: 'v2' | 'v6'; base: string } {
  const m = raw.match(/^v([26])-\//); // matches v2-/... or v6-/...
  const version = m ? (`v${m[1]}` as 'v2' | 'v6') : raw.includes('v2-') ? 'v2' : 'v6';
  let base = raw.replace(/^v[26]-\//, '/');
  if (!base.startsWith('/')) base = `/${base}`;
  return { version, base };
}

/**
 * Ensure the path starts with a single leading slash.
 */
export const ensureLeadingSlash = (p: string): string => {
  if (!p) return '/';
  return p.startsWith('/') ? p : `/${p}`;
};

/**
 * Remove the "v2-" / "v6-" selection prefix from a path like "v2-/iam"
 * and normalize to a leading-slash path like "/iam".
 *
 * @example
 * removeApiVersionPrefix("v2-/iam") === "/iam"
 * removeApiVersionPrefix("v6-/cloud") === "/cloud"
 * removeApiVersionPrefix("/iam") === "/iam"  // unchanged
 */
export const removeApiVersionPrefix = (apiPath: string): string => {
  let out = apiPath ?? '';
  if (out.startsWith(v2Prefix)) out = out.substring(v2Prefix.length);
  else if (out.startsWith(v6Prefix)) out = out.substring(v6Prefix.length);
  return ensureLeadingSlash(out);
};

/**
 * Split a list of selection values (e.g. ["v2-/iam", "v6-/cloud"]) into
 * v2 and v6 buckets, and return their normalized (prefix-stripped) forms.
 */
export const normalizeApiSelections = (apiPaths: string[]) => {
  const v2 = apiPaths.filter((p) => p.startsWith(v2Prefix)).map(removeApiVersionPrefix);
  const v6 = apiPaths.filter((p) => p.startsWith(v6Prefix)).map(removeApiVersionPrefix);
  return { v2, v6 };
};

/**
 * Count total operations over a list of services (all HTTP methods).
 */
export const countOperations = (services: ServiceOperations[]): number =>
  services.reduce((acc, s) => acc + (Array.isArray(s.operations) ? s.operations.length : 0), 0);

/**
 * Add a "v2-" / "v6-" selection prefix when the provided base path
 * is just a pure service path (e.g. "/iam" or "iam").
 * If it already has a version prefix, it is returned unchanged.
 *
 * @example
 * prefixApiVersion("v2", "/iam") === "v2-/iam"
 * prefixApiVersion("v6", "cloud") === "v6-/cloud"
 * prefixApiVersion("v2", "v2-/iam") === "v2-/iam"  // unchanged
 */
export const prefixApiVersion = (apiVersion: 'v2' | 'v6', basePath: string): string => {
  if (basePath.startsWith(v2Prefix) || basePath.startsWith(v6Prefix)) {
    return basePath;
  }
  const ver = apiVersion === 'v2' ? v2Prefix : v6Prefix;
  return `${ver}${ensureLeadingSlash(basePath)}`;
};
