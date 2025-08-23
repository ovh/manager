/**
 * @file prompts-helper.ts
 * @description Helpers used by prompts & endpoint preparation.
 */
import { AugmentedAnswers, GeneratorAnswers } from '../../playbook/types/playbook-types';
import { PromptChoice } from '../types/inquiries-types';
import { normalizePath } from '../utils/paths-utils';

/**
 * Convert a list of {@link PromptChoice} or strings into a plain string array.
 *
 * @param choices Input choices
 * @returns Array of string values
 */
export function transformPromptsChoicesToStrings(choices: PromptChoice[]): string[] {
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
 * Compute boolean flags from the app name and available endpoints.
 *
 * Adds:
 * - `isPCI`, `pciName`
 * - `isApiV6`, `isApiV2`
 *
 * @param d Augmented answers
 */
function deriveFlags(d: AugmentedAnswers): void {
  const isPCI = (d.appName || '').includes('pci');
  d.isPCI = isPCI;
  if (isPCI) d.pciName = (d.appName || '').split('pci-')[1];

  const apiV6Ops = d.apiV6Endpoints?.get?.operationList ?? [];
  const apiV2Ops = d.apiV2Endpoints?.get?.operationList ?? [];
  d.isApiV6 = apiV6Ops.length > 0;
  d.isApiV2 = apiV2Ops.length > 0;
}

/**
 * Extract and normalize listing/dashboard endpoints selected by the user.
 *
 * Updates:
 * - `listingEndpointPath`, `listingEndpointFn`
 * - `dashboardEndpointPath`, `dashboardEndpointFn`
 * - `mainApiPath`
 *
 * @param d Augmented answers
 * @returns Object with extracted paths and function names
 */
function extractPaths(d: AugmentedAnswers): {
  listingPath: string;
  listingFn: string;
  dashboardPath: string;
  dashboardFn: string;
} {
  const [listingPathRaw = '', listingFn = ''] =
    (d as unknown as { listingEndpoint?: string }).listingEndpoint?.split?.('-') ?? [];
  const [dashboardPathRaw = '', dashboardFn = ''] =
    (d as unknown as { dashboardEndpoint?: string }).dashboardEndpoint?.split?.('-') ?? [];

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
 * Set the main API version (v2/v6) for the listing path.
 * For PCI apps, also compute `mainApiPathPci`.
 *
 * @param d Augmented answers
 * @param listingPath Selected listing path
 */
function updateMainApiVersion(d: AugmentedAnswers, listingPath: string): void {
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
 * Compute reduced MethodGroups limited to listing & dashboard endpoints.
 * v2 additionally includes `/serviceInfos`.
 *
 * @param d Augmented answers
 * @param listingPath Selected listing path
 * @param dashboardPath Selected dashboard path
 */
function computeMethodGroups(
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
 * Derivation entrypoint: compute flags, extract selections, set versions, compute reduced groups.
 *
 * @param data Generator answers
 */
export function applyDerivations(data: GeneratorAnswers): void {
  const derivativeData = data as AugmentedAnswers;
  deriveFlags(derivativeData);

  const { listingPath, dashboardPath } = extractPaths(derivativeData);
  updateMainApiVersion(derivativeData, listingPath);
  computeMethodGroups(derivativeData, listingPath, dashboardPath);
}
