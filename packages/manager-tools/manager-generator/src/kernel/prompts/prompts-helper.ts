/**
 * @file prompts-helper.ts
 * @description Helpers used by prompts & endpoint preparation.
 */
import { AugmentedAnswers, GeneratorAnswers } from '../../playbook/types/playbook-types';
import { PromptChoice } from '../types/inquiries-types';
import { normalizePath } from '../utils/paths-utils';

/**
 * Check if is manual input prompt
 * @param v
 * @param manual
 */
export const isManualInputPrompt = (v: unknown, manual: string): v is string =>
  typeof v === 'string' && v === manual;

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
function extractPaths(d: AugmentedAnswers): {
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
 * Compute reduced MethodGroups limited to listing & onboarding endpoints.
 * v2 additionally includes `/serviceInfos`.
 *
 * @param d Augmented answers
 * @param listingPath Selected listing path
 * @param onboardingPath Selected onboarding path
 */
function computeMethodGroups(
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
  const derivativeData = data as AugmentedAnswers;
  deriveFlags(derivativeData);

  const { listingPath, onboardingPath } = extractPaths(derivativeData);
  updateMainApiVersion(derivativeData, listingPath);
  computeMethodGroups(derivativeData, listingPath, onboardingPath);
}
