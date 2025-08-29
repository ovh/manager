import axios, { AxiosResponse } from 'axios';

import { v2Endpoint, v2Prefix, v6Endpoint, v6Prefix } from '../../playbook/config/kernel-config';
import { ApiPathChoice, ServiceOperations, SwaggerServiceDoc } from '../types/api-types';
import { ensureLeadingSlash, normalizePath, stripApiVersionPrefix } from '../utils/paths-utils';

/**
 * Prefix a raw API path with the correct version prefix (`v2` or `v6`).
 *
 * Examples:
 * - `prefixApiVersion('v2', '/iam')` → `"v2-/iam"`
 * - `prefixApiVersion('v6', 'cloud/project')` → `"v6-/cloud/project"`
 *
 * @param apiVersion API version to prefix (`'v2'` or `'v6'`)
 * @param path Bare API path (with or without leading slash)
 * @returns Version-prefixed path string
 */
function prefixApiVersion(apiVersion: 'v2' | 'v6', path: string): string {
  const p = ensureLeadingSlash(path);
  return apiVersion === 'v2' ? `${v2Prefix}${p}` : `${v6Prefix}${p}`;
}

/**
 * Count the total number of HTTP operations across a list of service definitions.
 *
 * Each service may contain multiple operations (GET, POST, etc).
 *
 * @param services Array of service definitions
 * @returns Total number of operations found
 */
function countOperations(services: ServiceOperations[]): number {
  return services.reduce((acc, svc) => acc + (svc.operations ?? []).length, 0);
}

/**
 * Normalize selection strings into per-version arrays of normalized base paths.
 *
 * Input selections are strings with version prefixes (e.g., `"v2-/iam"`).
 * Each selection is stripped of its version prefix and brace-normalized.
 *
 * @example
 * Input: `["v2-/iam", "v6-/cloud", "v6-/cloud/project"]`
 * Output:
 * ```
 * {
 *   v2: ["/iam"],
 *   v6: ["/cloud", "/cloud/project"]
 * }
 * ```
 *
 * @param selections Array of selection strings with version prefixes
 * @returns Object with `v2` and `v6` arrays of normalized base paths
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
 * Fetch API template data for generator consumption.
 *
 * Responsibilities:
 * - Resolves provided API paths, adding version prefixes if missing
 * - Normalizes selections (brace-aware)
 * - Fetches Swagger service definitions for v2 and v6 APIs
 * - Counts total operations by version
 * - Returns the unified endpoints array plus counts
 *
 * @param apiVersion Version to assume when paths have no prefix (`'v2'` or `'v6'`)
 * @param apiPaths List of API paths (with or without version prefix)
 * @returns Promise resolving to:
 *  - `endpoints`: combined service operations (legacy `apis` shape)
 *  - `v2Ops`: count of v2 operations
 *  - `v6Ops`: count of v6 operations
 */
export const getApiTemplateData = async (
  apiVersion: 'v2' | 'v6',
  apiPaths: string[],
): Promise<{
  endpoints: ServiceOperations[];
  v2Ops: number;
  v6Ops: number;
}> => {
  const resolvedSelections = apiPaths.map((p) =>
    p.startsWith(v2Prefix) || p.startsWith(v6Prefix) ? p : prefixApiVersion(apiVersion, p),
  );

  const norm = normalizeApiSelections(resolvedSelections);
  console.log('[generator] normalized v2:', norm.v2);
  console.log('[generator] normalized v6:', norm.v6);

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

/**
 * Normalize a list of service operations by cleaning their `path` fields.
 *
 * Ensures all paths are consistently normalized for downstream matching.
 *
 * @param list Array of service operations
 * @returns Normalized service operations (never `undefined`)
 */
function normalizeServiceOperations(list: ServiceOperations[] | undefined): ServiceOperations[] {
  const apis = list ?? [];
  return apis.map((svc) => ({
    ...svc,
    path: normalizePath(svc.path),
  }));
}

/**
 * Fetch the Swagger service JSON for a given API path (e.g., `"v2-/iam"`).
 *
 * Behavior:
 * - Chooses correct base endpoint (v2/v6) based on prefix
 * - Strips prefix to build `.json` URL
 * - Fetches Swagger doc via Axios
 * - Normalizes service paths before returning
 * - Logs warnings on failure and falls back to an empty array
 *
 * @param apiPath Selection string (e.g., `"v2-/iam"` or `"v6-/cloud"`)
 * @returns Promise resolving to service list in legacy shape
 */
export const getApiServiceOperations = async (apiPath: string): Promise<ServiceOperations[]> => {
  const isV2 = apiPath.startsWith(v2Prefix);
  const endpoint = isV2 ? v2Endpoint : v6Endpoint;
  const servicePath = stripApiVersionPrefix(apiPath);
  const url = `${endpoint}${servicePath}.json`;

  console.info(`[generator] service url ${url}, for path ${servicePath} and endpoint: ${endpoint}`);

  try {
    const { data }: AxiosResponse<SwaggerServiceDoc> = await axios.get(url);
    return normalizeServiceOperations(data?.apis);
  } catch (err) {
    console.warn(
      `[generator] Failed to load swagger for ${apiPath} at ${url}:`,
      (err as Error)?.message ?? err,
    );
    return [];
  }
};

/**
 * Fetch the root API index and return all available base service paths.
 *
 * Example response shape:
 * ```
 * {
 *   apis: [{ path: "/iam" }, { path: "/cloud/project" }]
 * }
 * ```
 *
 * @param endpoint Root endpoint URL (e.g., `https://api.ovh.com/1.0`)
 * @returns Promise resolving to an array of normalized, unique base paths
 */
export async function fetchRootServicePaths(endpoint: string): Promise<string[]> {
  try {
    const { data } = await axios.get<{ apis?: Array<{ path: string }> }>(endpoint);
    const raw = (data?.apis ?? []).map((a) => a.path).filter(Boolean);

    const normalized = raw.map((p) => normalizePath(p));

    const seen = new Set<string>();
    const out: string[] = [];
    for (const p of normalized) {
      if (!seen.has(p)) {
        seen.add(p);
        out.push(p);
      }
    }
    return out;
  } catch (err) {
    console.warn(
      `[generator] Failed to fetch root API index from ${endpoint}:`,
      (err as Error)?.message ?? err,
    );
    return [];
  }
}

/**
 * Convert a list of base paths into ApiPathChoice objects
 * for the given API version.
 *
 * @param ver API version (`'v2'` or `'v6'`)
 * @param paths Normalized base paths (e.g., ["/iam", "/cloud"])
 * @returns Choices with `name` (displayed) and `value` (version-prefixed)
 */
export const toChoices = (ver: 'v2' | 'v6', paths: string[]): ApiPathChoice[] => {
  const pref = ver === 'v2' ? v2Prefix : v6Prefix;
  return paths.map((p) => {
    const norm = normalizePath(p);
    return { name: norm, value: `${pref}${ensureLeadingSlash(norm)}` };
  });
};
