import axios, { AxiosResponse } from 'axios';

import { v2Endpoint, v2Prefix, v6Endpoint, v6Prefix } from '../commons/config/kernel-constants';
import {
  ensureLeadingSlash,
  normalizePath,
  stripApiVersionPrefix,
} from '../commons/utils/paths-utils';
import { ApiPathChoice, ServiceOperations } from '../types/api-types';

/**
 * Subset of Swagger service doc we care about.
 */
interface SwaggerServiceDoc {
  apis?: ServiceOperations[];
}

/**
 * Normalize a list of ServiceOperations by fixing their `path` fields.
 */
function normalizeServiceOperations(list: ServiceOperations[] | undefined): ServiceOperations[] {
  const apis = list ?? [];
  return apis.map((svc) => ({
    ...svc,
    // Normalize server-returned paths for consistent downstream matching
    path: normalizePath(svc.path, { braceAware: true }),
  }));
}

/**
 * Fetch the Swagger service JSON for a given selection path (e.g. "v2-/iam"),
 * and return it in the **legacy shape** expected by the generator:
 *   [{ path, description, operations: [{ method, ... }, ...] }, ...]
 *
 * This function:
 *  - Chooses the correct base endpoint (v2/v6) from the prefix.
 *  - Strips the prefix and appends ".json" to build the URL.
 *  - Falls back to an empty array on errors, but logs a warning.
 *
 * @param apiPath Selection value such as "v2-/iam" or "v6-/cloud"
 * @returns Service list in legacy shape, ready for prompt consumption
 */
export const getApiServiceOperations = async (apiPath: string): Promise<ServiceOperations[]> => {
  const isV2 = apiPath.startsWith(v2Prefix);
  const endpoint = isV2 ? v2Endpoint : v6Endpoint;
  const servicePath = stripApiVersionPrefix(apiPath); // "/iam"
  const url = `${endpoint}${servicePath}.json`;

  console.info(`[generator] service url ${url}, for path ${servicePath} and endpoint: ${endpoint}`);

  try {
    const { data }: AxiosResponse<SwaggerServiceDoc> = await axios.get(url);
    // Normalize paths before returning (downstream expects `apis` with nested operations).
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
 * Fetch the root API index once and return the list of service base paths (e.g., "/iam").
 */
async function fetchRootServicePaths(endpoint: string): Promise<string[]> {
  try {
    const { data } = await axios.get<{ apis?: Array<{ path: string }> }>(endpoint);
    const raw = (data?.apis ?? []).map((a) => a.path).filter(Boolean);
    // Normalize base paths eagerly
    const normalized = raw.map((p) => normalizePath(p));
    // De-duplicate while preserving order
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
 * Build prompt choices for API base paths including "v2-" and "v6-" prefixed entries,
 * with separators as non-selectable headers.
 *
 * Example:
 * [
 *   { type: 'separator', line: '— API v2 —' },
 *   { name: '/iam', value: 'v2-/iam' },
 *   ...
 *   { type: 'separator', line: '— API v6 —' },
 *   { name: '/iam', value: 'v6-/iam' },
 *   ...
 * ]
 */
export async function getApiPaths(): Promise<ApiPathChoice[]> {
  // One index is enough (v2/v6 share the same root list), but keep it flexible.
  const basePaths = await fetchRootServicePaths(v2Endpoint);

  const toChoices = (ver: 'v2' | 'v6'): ApiPathChoice[] => {
    const pref = ver === 'v2' ? v2Prefix : v6Prefix;
    return basePaths.map((p) => {
      const norm = normalizePath(p); // ensure consistent formatting
      return { name: norm, value: `${pref}${ensureLeadingSlash(norm)}` };
    });
  };

  return [
    { type: 'separator', line: '— API v2 —' },
    ...toChoices('v2'),
    { type: 'separator', line: '— API v6 —' },
    ...toChoices('v6'),
  ];
}
