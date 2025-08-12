/**
 * @file service-key.ts
 * @description Utility for deriving a stable `serviceKey` value from the listing endpoint path.
 */

/**
 * Parameters for `deriveServiceKey`.
 */
export interface ServiceKeyArgs {
  /**
   * The listing endpoint path provided to the generator.
   * Examples:
   * - "/v2/users/list"
   * - "/"
   * - "/cloud/project/{serviceName}-getProject"
   */
  listingEndpointPath: string;

  /**
   * The application name, used for fallback when `listingEndpointPath` is "/".
   */
  appName: string;
}

/**
 * Convert a string to kebab-case for app names.
 * Removes quotes, replaces non-alphanumerics with `-`, collapses duplicate dashes,
 * trims leading/trailing dashes, and lowercases the result.
 *
 * @param input - The string to convert.
 * @returns {string} The kebab-cased string.
 */
function kebab(input: string): string {
  return String(input || '')
    .replace(/['"]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

/**
 * Derive a stable `serviceKey` from a listing endpoint path.
 *
 * **Rules** (mirroring test scenarios):
 * - If the path is "/" or empty → returns `"<kebab(appName)>-listing"`.
 * - Performs brace-aware cut: keeps everything up to the first closing brace `}` if present,
 *   dropping any suffix after it (e.g. `"/cloud/project/{serviceName}-getProject"` → `"/cloud/project/{serviceName}"`).
 * - Removes leading `/` characters and splits the path into segments.
 * - Replaces segments of the form `{param}` with just `param`.
 * - Preserves the original casing for static segments.
 * - Joins all segments with a single `-`.
 *
 * @param {ServiceKeyArgs} args - The input arguments.
 * @returns {string} The derived service key string.
 *
 * @example
 * // Standard kebab from v2 path
 * deriveServiceKey({ listingEndpointPath: '/v2/users/list', appName: 'ignored' });
 * // => 'v2-users-list'
 *
 * @example
 * // Brace-aware combined endpoint
 * deriveServiceKey({ listingEndpointPath: '/cloud/project/{serviceName}-getProject', appName: 'ignored' });
 * // => 'cloud-project-serviceName'
 *
 * @example
 * // Fallback for root path
 * deriveServiceKey({ listingEndpointPath: '/', appName: 'My-App' });
 * // => 'my-app-listing'
 *
 * @example
 * // Preserve static casing
 * deriveServiceKey({ listingEndpointPath: '/ovhCloudConnect', appName: 'ignored' });
 * // => 'ovhCloudConnect'
 */
export function deriveServiceKey({ listingEndpointPath, appName }: ServiceKeyArgs): string {
  const raw = String(listingEndpointPath ?? '').trim();

  // Fallback when listing is "/" or empty
  if (raw === '' || raw === '/') {
    return `${kebab(appName)}-listing`;
  }

  // Brace-aware cut
  const cut = (() => {
    const braceIdx = raw.indexOf('}');
    return braceIdx >= 0 ? raw.slice(0, braceIdx + 1) : raw;
  })();

  // Split into segments and normalize
  const parts = cut.replace(/^\/+/, '').split('/').filter(Boolean);
  const mapped = parts.map((seg) => {
    const m = seg.match(/^\{([^}]+)\}$/);
    return m ? m[1] : seg;
  });

  return mapped.join('-');
}
