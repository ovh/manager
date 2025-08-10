import { v2Prefix, v6Prefix } from '../config/kernel-constants';
import { ServiceOperations } from '../types/api-types';
import { countOperations, normalizeApiSelections, prefixApiVersion } from './api-helper';
import { getApiServiceOperations } from './api-main';

/**
 * Assemble API data for generator templates:
 *  - Accepts an apiVersion hint ("v2" | "v6") and a list of apiPaths.
 *  - Any bare paths ("/iam") are prefixed with the provided apiVersion.
 *  - Fetches each service JSON and returns the legacy "apis" shape.
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

  // Pretty logs for humans
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
