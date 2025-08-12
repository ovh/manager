import { v2Prefix, v6Prefix } from '../commons/config/kernel-constants';
import {
  ensureLeadingSlash,
  normalizePath,
  stripApiVersionPrefix,
} from '../commons/utils/paths-utils';
import { ServiceOperations } from '../types/api-types';
import { getApiServiceOperations } from './api-main';

/**
 * Prefix a bare path with the given API version prefix.
 */
function prefixApiVersion(apiVersion: 'v2' | 'v6', path: string): string {
  const p = ensureLeadingSlash(path);
  return apiVersion === 'v2' ? `${v2Prefix}${p}` : `${v6Prefix}${p}`;
}

/**
 * Count total operations (all HTTP methods) in a list of ServiceOperations.
 */
function countOperations(services: ServiceOperations[]): number {
  return services.reduce((acc, svc) => acc + (svc.operations ?? []).length, 0);
}

/**
 * Normalize selection strings into per-version arrays of normalized base paths.
 * Example input:
 *   ["v2-/iam", "v6-/cloud", "v6-/cloud/project"]
 * Output:
 *   { v2: ["/iam"], v6: ["/cloud", "/cloud/project"] }  // brace-aware normalized
 */
function normalizeApiSelections(selections: string[]): { v2: string[]; v6: string[] } {
  const out = { v2: [] as string[], v6: [] as string[] };
  for (const sel of selections) {
    if (sel.startsWith(v2Prefix)) {
      const base = normalizePath(stripApiVersionPrefix(sel), { braceAware: true });
      out.v2.push(base);
    } else if (sel.startsWith(v6Prefix)) {
      const base = normalizePath(stripApiVersionPrefix(sel), { braceAware: true });
      out.v6.push(base);
    }
  }
  return out;
}

/**
 * Assemble API data for generator templates:
 *  - Accepts an apiVersion hint ("v2" | "v6") and a list of apiPaths.
 *  - Any bare paths ("/iam") are prefixed with the provided apiVersion.
 *  - Fetches each service JSON and returns the legacy "apis" shape (with normalized paths).
 *  - Logs useful debug information (normalized selections, op counts).
 *
 * The returned `endpoints` is what downstream expects:
 *   [{ path, description, operations: [{ method, ... }, ...] }, ...]
 */
export const getApiTemplateData = async (
  apiVersion: 'v2' | 'v6',
  apiPaths: string[],
): Promise<{
  endpoints: ServiceOperations[];
  v2Ops: number;
  v6Ops: number;
}> => {
  // Normalize inputs: add missing version prefix when needed
  const resolvedSelections = apiPaths.map((p) =>
    p.startsWith(v2Prefix) || p.startsWith(v6Prefix) ? p : prefixApiVersion(apiVersion, p),
  );

  console.log('[generator] selected apiPaths:', resolvedSelections);

  // Pretty logs for humans (brace-aware normalized bases)
  const norm = normalizeApiSelections(resolvedSelections);
  console.log('[generator] normalized v2:', norm.v2);
  console.log('[generator] normalized v6:', norm.v6);

  // Fetch in two passes so we can compute separate counts
  const v2Selections = resolvedSelections.filter((p) => p.startsWith(v2Prefix));
  const v6Selections = resolvedSelections.filter((p) => p.startsWith(v6Prefix));

  const v2ServicesNested = await Promise.all(
    v2Selections.map((sel) => getApiServiceOperations(sel)),
  );
  const v6ServicesNested = await Promise.all(
    v6Selections.map((sel) => getApiServiceOperations(sel)),
  );

  const v2Services = v2ServicesNested.flat();
  const v6Services = v6ServicesNested.flat();
  const endpoints = [...v2Services, ...v6Services];

  const v2Ops = countOperations(v2Services);
  const v6Ops = countOperations(v6Services);

  console.log(`[generator] rawOps (all methods) — v2: ${v2Ops} | v6: ${v6Ops}`);

  return { endpoints, v2Ops, v6Ops };
};
