/**
 * @file prompts-helper.ts
 * @description Helpers used by prompts & endpoint preparation.
 */
import { AugmentedAnswers, GeneratorAnswers } from '../../playbook/types/playbook-types';
import { getApiTemplateData } from '../api/api-helper';
import { ApiPathChoice, ServiceOperations } from '../types/api-types';
import { MethodGroup, OperationItem, PromptChoice } from '../types/inquiries-types';
import { normalizePath, splitApiPathsByVersion } from '../utils/paths-utils';

/**
 * Ensure a string ends with a given suffix exactly once.
 *
 * @param s Input string
 * @param suffix Required suffix to append if missing
 * @returns The string guaranteed to end with the suffix
 *
 * @example
 * ensureSuffix("demo", "-app") // "demo-app"
 */
export function ensureSuffix(s: string, suffix: string): string {
  return s.endsWith(suffix) ? s : `${s}${suffix}`;
}

/**
 * Derive a final package name for an application.
 *
 * Rules:
 * - Use the provided `packageName` if non-empty.
 * - Otherwise normalize `appName`:
 *   - Keep only `[a-z0-9-]`
 *   - Lowercase everything
 *   - Ensure a single `-app` suffix
 *   - Prefix with `@ovh-ux/manager-`
 *
 * @param appName Application name (free-form input)
 * @param packageName Optional explicit package name
 * @returns A scoped, normalized package name
 *
 * @example
 * derivePkgName("pci-demo")        // "@ovh-ux/manager-pci-demo-app"
 * derivePkgName("web")             // "@ovh-ux/manager-web-app"
 * derivePkgName("zimbra-ui", "z")  // "z"
 */
export function derivePkgName(appName: string, packageName?: string): string {
  console.log({
    appName,
    packageName,
  });
  if (packageName && packageName.trim()) return packageName.trim();
  const norm = appName.replace(/[^a-z0-9-]/gi, '').toLowerCase();
  const withApp = ensureSuffix(norm, '-app');

  console.log({
    norm,
    withApp,
    full: `@ovh-ux/manager-${withApp}`,
  });
  return `@ovh-ux/manager-${withApp}`;
}

/**
 * Type guard: check if a value is a `{ name, value }` pair.
 *
 * @param x Unknown value
 * @returns True if `x` is an object with `name` and `value`
 */
export function isNameValue(x: unknown): x is { name: string; value: string } {
  return !!x && typeof x === 'object' && 'name' in x && 'value' in x;
}

/**
 * Type guard: check if a value is a "separator-like" choice
 * produced by `getApiPaths`.
 *
 * @param x Unknown value
 * @returns True if `x` has `{ type: 'separator' }`
 */
export function isSeparatorLike(x: unknown): x is { type: 'separator'; line?: string } {
  return (
    !!x && typeof x === 'object' && 'type' in x && (x as { type: unknown }).type === 'separator'
  );
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

/**
 * Fallback function name derivation when Swagger lacks one.
 *
 * Strategy:
 * - Prefix with HTTP method
 * - First path segment lowercased
 * - Remaining segments TitleCased
 * - Append "List" if response type suggests an array
 *
 * @param method HTTP method string
 * @param apiPath API path string (e.g., "/cloud/project")
 * @param responseType Optional response type string
 * @returns Derived function name
 */
function fallbackFunctionName(method: string, apiPath: string, responseType?: string): string {
  const m = (method || 'GET').toLowerCase();

  const segs = apiPath
    .replace(/^\//, '')
    .split('/')
    .filter(Boolean)
    .map((seg) => seg.replace(/[{}]/g, ''))
    .map((seg) => seg.replace(/[^a-zA-Z0-9]/g, ''));

  if (segs.length === 0) return m;

  const first = segs?.[0]?.toLowerCase() || '';
  const rest = segs.slice(1).map((s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : ''));

  let name = m + first + rest.join('');

  if (responseType && /\[\]\s*$/.test(responseType)) {
    name += 'List';
  }

  return name;
}

/**
 * Safely read a string field from a generic object.
 *
 * @param obj Source object
 * @param key Property key to read
 * @returns The string if valid, else undefined
 */
function readOptionalString(obj: Record<string, unknown>, key: string): string | undefined {
  const v = obj[key];
  return typeof v === 'string' ? v : undefined;
}

/**
 * Convert Swagger service entries into a {@link MethodGroup}.
 *
 * - Keeps full API paths (no brace-trimming)
 * - Includes GET operations only
 * - Uses Swagger-provided names when possible, else falls back
 *
 * @param services Array of Swagger service definitions
 * @returns A MethodGroup with collected GET operations
 */
// eslint-disable-next-line complexity
export function servicesToMethodGroup(services: ServiceOperations[]): MethodGroup {
  const opList: OperationItem[] = [];

  for (const svc of services) {
    const basePathRaw = svc.path;
    const apiPathForDisplay = normalizePath(basePathRaw, { braceAware: false });

    const ops = svc.operations ?? [];
    for (const op of ops) {
      const opRec = op as unknown as Record<string, unknown>;

      const methodCandidate =
        (typeof op.method === 'string' ? op.method : undefined) ??
        readOptionalString(opRec, 'httpMethod') ??
        readOptionalString(opRec, 'type');
      const methodRaw = (methodCandidate ?? 'GET').toUpperCase();
      if (methodRaw !== 'GET') continue;

      const opApiPathField = readOptionalString(opRec, 'apiPath');
      const opUrlField = readOptionalString(opRec, 'url');
      const opPathField = readOptionalString(opRec, 'path');

      const urlAsPath =
        opUrlField && opUrlField.trim()
          ? opUrlField?.split?.('?')?.[0]?.replace?.(/\$\{params\.([a-zA-Z0-9_]+)\}/g, '{$1}')
          : undefined;

      const rawOpPath =
        opApiPathField?.trim() || urlAsPath?.trim() || opPathField?.trim() || apiPathForDisplay;

      const fullPath = normalizePath(rawOpPath, { braceAware: false });

      const nickname = readOptionalString(opRec, 'nickname');
      const operationId = readOptionalString(opRec, 'operationId');
      const providedFn = readOptionalString(opRec, 'functionName');
      const responseType = readOptionalString(opRec, 'responseType');

      const functionName =
        providedFn ??
        nickname ??
        operationId ??
        fallbackFunctionName(methodRaw, fullPath, responseType);

      opList.push({ apiPath: fullPath, functionName });
    }
  }

  return { get: { operationList: opList } };
}

/**
 * Prepare endpoints before prompting user for listing/onboarding config.
 *
 * Steps:
 * - Set template defaults
 * - Split apiPaths into v2/v6 groups
 * - Fetch and normalize Swagger docs
 * - Convert to MethodGroups
 * - Resolve package name
 *
 * @param answers Generator answers object (augmented in place)
 */
export async function prepareEndpointsForListing(answers: GeneratorAnswers): Promise<void> {
  const augmentedAnswers = answers as AugmentedAnswers & { apiPaths?: string[] };
  augmentedAnswers.templates = ['listing', 'onboarding'];

  const selectedPaths = augmentedAnswers.apiPaths ?? [];
  const byVersion = splitApiPathsByVersion(selectedPaths);
  augmentedAnswers.apiPathsByApiVersion = byVersion;

  const v6Data = await getApiTemplateData('v6', byVersion.v6);
  const v2Data = await getApiTemplateData('v2', byVersion.v2);

  augmentedAnswers.apiV6Endpoints = servicesToMethodGroup(v6Data.endpoints);
  augmentedAnswers.apiV2Endpoints = servicesToMethodGroup(v2Data.endpoints);

  console.log('[generator] selected apiPaths:', selectedPaths);
  console.log('[generator] normalized v2:', byVersion.v2);
  console.log('[generator] normalized v6:', byVersion.v6);
  console.log(
    '[generator] getOps (GET only) — v2:',
    augmentedAnswers.apiV2Endpoints?.get?.operationList?.length ?? 0,
    '| v6:',
    augmentedAnswers.apiV6Endpoints?.get?.operationList?.length ?? 0,
  );
}

/**
 * Compute boolean flags from the app name and available endpoints.
 *
 * Adds:
 * - `isPCI`, `pciName`
 * - `isApiV6`, `isApiV2`
 *
 * @param d Augmented answers
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
 * Extract and normalize listing/onboarding endpoints selected by the user.
 *
 * Updates:
 * - `listingEndpointPath`, `listingEndpointFn`
 * - `onboardingEndpointPath`, `onboardingEndpointFn`
 * - `mainApiPath`
 *
 * @param d Augmented answers
 * @returns Object with extracted paths and function names
 */
export function extractSelectedPaths(d: AugmentedAnswers): {
  listingPath: string;
  listingFn: string;
  onboardingPath: string;
  onboardingFn: string;
} {
  const [listingPathRaw = '', listingFn = ''] =
    (d as unknown as { listingEndpoint?: string }).listingEndpoint?.split?.('-') ?? [];
  const [onboardingPathRaw = '', onboardingFn = ''] =
    (d as unknown as { onboardingEndpoint?: string }).onboardingEndpoint?.split?.('-') ?? [];

  const listingPath = normalizePath(listingPathRaw, { braceAware: true });
  const onboardingPath = normalizePath(onboardingPathRaw, { braceAware: true });

  d.listingEndpointPath = listingPath;
  d.listingEndpointFn = listingFn;
  d.onboardingEndpointPath = onboardingPath;
  d.onboardingEndpointFn = onboardingFn;
  d.mainApiPath = listingPath;

  return { listingPath, listingFn, onboardingPath, onboardingFn };
}

/**
 * Set the main API version (v2/v6) for the listing path.
 * For PCI apps, also compute `mainApiPathPci`.
 *
 * @param d Augmented answers
 * @param listingPath Selected listing path
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
 * Compute reduced MethodGroups limited to listing & onboarding endpoints.
 * v2 additionally includes `/serviceInfos`.
 *
 * @param d Augmented answers
 * @param listingPath Selected listing path
 * @param onboardingPath Selected onboarding path
 */
export function computeComputedGroups(
  d: AugmentedAnswers,
  listingPath: string,
  onboardingPath: string,
): void {
  const v6Ops = d.apiV6Endpoints?.get?.operationList ?? [];
  const v2Ops = d.apiV2Endpoints?.get?.operationList ?? [];

  d.apiV6Computed = d.isApiV6
    ? {
        get: {
          ...(d.apiV6Endpoints?.get ?? {}),
          operationList: v6Ops.filter(({ apiPath }) =>
            [listingPath, onboardingPath].includes(apiPath),
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
              [listingPath, onboardingPath].includes(apiPath) || apiPath.includes('/serviceInfos'),
          ),
        },
      }
    : undefined;
}

/**
 * Derivation entrypoint: compute flags, extract selections, set versions, compute reduced groups.
 *
 * @param data Generator answers
 */
export function applyDerivations(data: GeneratorAnswers): void {
  const d = data as AugmentedAnswers;
  computeFlags(d);
  const { listingPath, onboardingPath } = extractSelectedPaths(d);
  setMainApiVersion(d, listingPath);
  computeComputedGroups(d, listingPath, onboardingPath);
}

/**
 * Convert a list of {@link PromptChoice} or strings into a plain string array.
 *
 * @param choices Input choices
 * @returns Array of string values
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
 * Build flat endpoint identifiers for available operations.
 *
 * Format: `${apiPath}-${functionName}`
 *
 * @param v2 Optional v2 MethodGroup
 * @param v6 Optional v6 MethodGroup
 * @returns Sorted string array of identifiers
 */
export function buildEndpointChoiceValues(v2?: MethodGroup, v6?: MethodGroup): string[] {
  const collect = (mg?: MethodGroup): OperationItem[] =>
    mg
      ? Object.values(mg)
          .filter(Boolean)
          .flatMap((g) => g!.operationList ?? [])
      : [];

  const toVal = ({ apiPath, functionName }: OperationItem) => `${apiPath}-${functionName}`;

  const v2Vals = collect(v2)
    .map(toVal)
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
  const v6Vals = collect(v6)
    .map(toVal)
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));

  return [...v2Vals, ...v6Vals];
}

/**
 * Check if a string matches the generator’s endpoint value format.
 *
 * Format: `{path}-{functionName}`
 *
 * @param s Input string
 * @returns True if the string follows the expected format
 */
export function isEndpointValueFormat(s: string): boolean {
  const idx = s.indexOf('-');
  if (idx <= 0) return false;
  const pathPart = s.slice(0, idx);
  return pathPart.trim().startsWith('/');
}

/**
 * Check if is manual input
 * @param v
 * @param manual
 */
export const isManualValue = (v: unknown, manual: string): v is string =>
  typeof v === 'string' && v === manual;
