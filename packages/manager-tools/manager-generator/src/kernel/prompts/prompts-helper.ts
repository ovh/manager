/**
 * @file prompts-helper.ts
 * @description Helpers used by prompts & endpoint preparation.
 */
import { normalizePath } from 'src/kernel/commons/utils/paths-utils';

import { AugmentedAnswers, GeneratorAnswers } from '../../playbook/types/playbook-types';
import { normalizeSelectedApiPath } from '../api/api-helper';
import { getApiTemplateData } from '../api/get-api-template-data';
import { ApiPathChoice, ServiceOperations } from '../types/api-types';
import { MethodGroup, OperationItem, PromptChoice, VersionSplit } from '../types/inquiries-types';

/**
 * Ensure a string ends with a given suffix exactly once.
 */
export function ensureSuffix(s: string, suffix: string): string {
  return s.endsWith(suffix) ? s : `${s}${suffix}`;
}

/**
 * Derive a final package name, preferring a user-provided packageName.
 * Falls back to a normalized appName under the @ovh-ux scope, with a single "-app" suffix.
 *
 * Examples:
 *  - derivePkgName("pci-demo", "")         => "@ovh-ux/manager-pci-demo-app"
 *  - derivePkgName("web", undefined)       => "@ovh-ux/manager-web-app"
 *  - derivePkgName("zimbra-ui", "ddd")     => "ddd"
 */
export function derivePkgName(appName: string, packageName?: string): string {
  if (packageName && packageName.trim()) return packageName.trim();
  const norm = appName.replace(/[^a-z0-9-]/gi, '').toLowerCase();
  const withApp = ensureSuffix(norm, '-app');
  return `@ovh-ux/manager-${withApp}`;
}

/**
 * Type guard: `{ name, value }` choice row.
 */
export function isNameValue(x: unknown): x is { name: string; value: string } {
  return !!x && typeof x === 'object' && 'name' in x && 'value' in x;
}

/**
 * Type guard: legacy separator-like shape coming from getApiPaths().
 */
export function isSeparatorLike(x: unknown): x is { type: 'separator'; line?: string } {
  return (
    !!x && typeof x === 'object' && 'type' in x && (x as { type: unknown }).type === 'separator'
  );
}

/**
 * Normalize ApiPath choices (which may include separators) to our local PromptChoice[]
 * without using inquirer.Separator (we use disabled items as headers).
 *
 * NOTE: When choices are plain strings (paths), we keep them as-is because we’ll normalize
 * them again at selection time via `normalizeSelectedApiPath` and `normalizePath`.
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

/**
 * Split selected API base paths into v2 / v6 buckets.
 * Uses normalizeSelectedApiPath, then brace-aware normalization for consistent matching.
 */
export function splitApiPathsByVersion(paths: string[]): VersionSplit {
  const out: VersionSplit = { v2: [], v6: [] };
  for (const p of paths) {
    const { version, base } = normalizeSelectedApiPath(p);
    const normBase = normalizePath(base, { braceAware: true });
    out[version].push(normBase);
  }
  return out;
}

/**
 * Make a simple function name if the swagger operation has no nickname/operationId.
 * Example:
 *   method=GET, path=/cloud/project/{projectId}/serviceInfos
 *   -> "getCloudProjectServiceInfos"
 */
function fallbackFunctionName(method: string, apiPath: string): string {
  const clean = apiPath
    .replace(/^\//, '')
    .replace(/[{}]/g, '')
    .split('/')
    .filter(Boolean)
    .map((seg) => seg.replace(/[^a-zA-Z0-9]/g, ''))
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
    .join('');
  const m = (method || 'GET').toLowerCase();
  return `${m}${clean}`;
}

/**
 * Safe helper to read an optional string field off a generic object.
 */
function readOptionalString(obj: Record<string, unknown>, key: string): string | undefined {
  const v = obj[key];
  return typeof v === 'string' ? v : undefined;
}

/**
 * Convert swagger service entries to our MethodGroup (GET-only for prompts).
 * Avoids `any` by reading unknown fields via guards/Record lookups.
 * Normalizes `apiPath` using `normalizePath(..., { braceAware: true })` for consistency.
 */
function servicesToMethodGroup(services: ServiceOperations[]): MethodGroup {
  const opList: OperationItem[] = [];

  for (const svc of services) {
    const basePathRaw = svc.path;
    const apiPath = normalizePath(basePathRaw, { braceAware: true });

    const ops = svc.operations ?? [];
    for (const op of ops) {
      const opRec = op as unknown as Record<string, unknown>;
      const methodCandidate =
        (typeof op.method === 'string' ? op.method : undefined) ??
        readOptionalString(opRec, 'httpMethod') ??
        '';
      const methodRaw = methodCandidate.toUpperCase();
      if (methodRaw !== 'GET') continue;

      const nickname = typeof op.nickname === 'string' ? op.nickname : undefined;
      const operationId = readOptionalString(opRec, 'operationId');
      const functionName = nickname ?? operationId ?? fallbackFunctionName(methodRaw, apiPath);

      const item: OperationItem = {
        apiPath,
        functionName,
      };
      opList.push(item);
    }
  }

  return {
    get: {
      operationList: opList,
    },
  };
}

/**
 * Prepare endpoints prior to the listing/dashboard prompts:
 * - set `templates`
 * - split apiPaths per version (normalized)
 * - fetch template data for v2 / v6
 * - convert to MethodGroup the prompts expect (normalized paths)
 * - derive final package name for templates (`packageNameResolved`)
 */
export async function prepareEndpointsForListing(data: GeneratorAnswers): Promise<void> {
  const d = data as AugmentedAnswers & { apiPaths?: string[] };
  d.templates = ['listing', 'onboarding', 'dashboard'];

  const selectedPaths = d.apiPaths ?? [];
  const byVersion = splitApiPathsByVersion(selectedPaths);
  d.apiPathsByApiVersion = byVersion;

  // NOTE: getApiTemplateData signature is (apiVersion, apiPaths)
  const v6Data = await getApiTemplateData('v6', byVersion.v6);
  const v2Data = await getApiTemplateData('v2', byVersion.v2);

  // Adapt to MethodGroup (normalize inside)
  d.apiV6Endpoints = servicesToMethodGroup(v6Data.endpoints);
  d.apiV2Endpoints = servicesToMethodGroup(v2Data.endpoints);

  // Resolve final package name once, for templates
  d.packageNameResolved = derivePkgName(d.appName ?? '', d.packageName);

  // (optional) debug
  console.log('[generator] selected apiPaths:', selectedPaths);
  console.log('[generator] normalized v2:', byVersion.v2);
  console.log('[generator] normalized v6:', byVersion.v6);
  console.log(
    '[generator] getOps (GET only) — v2:',
    d.apiV2Endpoints?.get?.operationList?.length ?? 0,
    '| v6:',
    d.apiV6Endpoints?.get?.operationList?.length ?? 0,
  );
}

/**
 * Compute basic flags based on app name and fetched endpoint lists.
 */
export function computeFlags(d: AugmentedAnswers): void {
  const isPCI = (d.appName || '').includes('pci');
  d.isPCI = isPCI;
  if (isPCI) d.pciName = (d.appName || '').split('pci-')[1];

  const apiV6Ops = d.apiV6Endpoints?.get?.operationList ?? [];
  const apiV2Ops = d.apiV2Endpoints?.get?.operationList ?? [];
  d.isApiV6 = apiV6Ops.length > 0;
  d.isApiV2 = apiV2Ops.length > 0;
}

/**
 * Extract the selected listing/dashboard paths & functions from user picks,
 * normalize them, and set `mainApiPath` from listing.
 */
export function extractSelectedPaths(d: AugmentedAnswers): {
  listingPath: string;
  listingFn: string;
  dashboardPath: string;
  dashboardFn: string;
} {
  const [listingPathRaw = '', listingFn = ''] =
    (d as unknown as { listingEndpoint?: string }).listingEndpoint?.split('-') ?? [];
  const [dashboardPathRaw = '', dashboardFn = ''] =
    (d as unknown as { dashboardEndpoint?: string }).dashboardEndpoint?.split('-') ?? [];

  // Normalize for downstream matching/derivation
  const listingPath = normalizePath(listingPathRaw, { braceAware: true });
  const dashboardPath = normalizePath(dashboardPathRaw, { braceAware: true });

  d.listingEndpointPath = listingPath;
  d.listingEndpointFn = listingFn;
  d.dashboardEndpointPath = dashboardPath;
  d.dashboardEndpointFn = dashboardFn;
  d.mainApiPath = listingPath;

  return { listingPath, listingFn, dashboardPath, dashboardFn };
}

/**
 * Mark whether the main API path is v2 or v6 and compute `mainApiPathPci` when needed.
 * Assumes endpoints in `d.apiV2Endpoints` / `d.apiV6Endpoints` are already normalized.
 */
export function setMainApiVersion(d: AugmentedAnswers, listingPath: string): void {
  const apiV2Ops = d.apiV2Endpoints?.get?.operationList ?? [];
  const isMainV2 = apiV2Ops.map(({ apiPath }) => apiPath).includes(listingPath);
  d.mainApiPathApiVersion = isMainV2 ? 'v2' : 'v6';

  if (d.isPCI) {
    d.mainApiPathPci = listingPath.replace(
      d.isApiV2 ? '{projectId}' : '{serviceName}',
      '${projectId}',
    );
  }
}

/**
 * Compute reduced V2/V6 groups to only the listing & dashboard ops (+/serviceInfos for v2).
 */
export function computeComputedGroups(
  d: AugmentedAnswers,
  listingPath: string,
  dashboardPath: string,
): void {
  const v6Ops = d.apiV6Endpoints?.get?.operationList ?? [];
  const v2Ops = d.apiV2Endpoints?.get?.operationList ?? [];

  d.apiV6Computed = d.isApiV6
    ? {
        get: {
          ...(d.apiV6Endpoints?.get ?? {}),
          operationList: v6Ops.filter(({ apiPath }) =>
            [listingPath, dashboardPath].includes(apiPath),
          ),
        },
      }
    : undefined;

  d.apiV2Computed = d.isApiV2
    ? {
        get: {
          ...(d.apiV2Endpoints?.get ?? {}),
          operationList: v2Ops.filter(
            ({ apiPath }) =>
              [listingPath, dashboardPath].includes(apiPath) || apiPath.includes('/serviceInfos'),
          ),
        },
      }
    : undefined;
}

/**
 * Accurate derivation entrypoint used in the `when` handler before serviceKey.
 */
export function applyDerivations(data: GeneratorAnswers): void {
  const d = data as AugmentedAnswers;
  computeFlags(d);
  const { listingPath, dashboardPath } = extractSelectedPaths(d);
  setMainApiVersion(d, listingPath);
  computeComputedGroups(d, listingPath, dashboardPath);
}

/**
 * Convert an array of PromptChoice objects or strings into a plain string array
 * containing only the choice values.
 */
export function choicesToStrings(choices: PromptChoice[]): string[] {
  const out: string[] = [];
  for (const c of choices) {
    if (typeof c === 'string') {
      out.push(c);
    } else if ('value' in c) {
      out.push(c.value);
    }
  }
  return out;
}

/**
 * Build a flat list of string values representing available API endpoint operations
 * from both v2 and v6 method groups.
 *
 * Each value: `${apiPath}-${functionName}`
 */
export function buildEndpointChoiceValues(v2?: MethodGroup, v6?: MethodGroup): string[] {
  const collect = (mg?: MethodGroup): OperationItem[] =>
    mg
      ? Object.values(mg)
          .filter(Boolean)
          .flatMap((g) => g!.operationList ?? [])
      : [];

  const toVal = ({ apiPath, functionName }: OperationItem) => `${apiPath}-${functionName}`;

  return [...collect(v2).map(toVal), ...collect(v6).map(toVal)];
}

/**
 * Check whether a string follows the endpoint value format used in the generator.
 */
export function isEndpointValueFormat(s: string): boolean {
  const idx = s.indexOf('-');
  if (idx <= 0) return false;
  const pathPart = s.slice(0, idx);
  return pathPart.trim().startsWith('/');
}
