/**
 * @file api-helper.ts
 * @description Helpers for normalizing selected API paths and server-returned paths.
 */
import { normalizePath } from 'src/kernel/commons/utils/paths-utils';

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

  const pathPart = lastDash > 0 ? raw.slice(0, lastDash) : raw;
  const base = normalizePath(pathPart, { braceAware: true });

  // Heuristic: v2 if path starts with "/v2", otherwise v6
  const version: 'v2' | 'v6' = base.startsWith('/v2') ? 'v2' : 'v6';

  return { version, base };
}

/**
 * Normalize a server-returned Swagger/REST path for consistent internal matching.
 * Applies:
 *  - Ensures leading slash
 *  - Strips "vN-/" prefix if present (e.g., "v6-/x" → "/x")
 *  - Brace-aware cut ("/{id}-suffix" → "/{id}")
 *
 * @param path Server-returned path string.
 * @returns Normalized path (brace-aware).
 */
export function normalizeServerPath(path: string): string {
  return normalizePath(path, { braceAware: true });
}
