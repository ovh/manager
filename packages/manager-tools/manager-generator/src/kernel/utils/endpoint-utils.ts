import { AugmentedAnswers, GeneratorAnswers } from '../../playbook/types/playbook-types';
import { getApiTemplateData } from '../api/api-helper';
import { MethodGroup, OperationItem } from '../types/inquiries-types';
import { splitApiPathsByVersion } from './paths-utils';
import { servicesToMethodGroup } from './services-utils';

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
 * Prepare endpoints before prompting user for listing/dashboard config.
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
  augmentedAnswers.templates = ['listing', 'dashboard'];

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
