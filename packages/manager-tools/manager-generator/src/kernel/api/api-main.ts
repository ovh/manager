import { v2Endpoint, v6Endpoint } from '../../playbook/config/kernel-config';
import { ApiPathChoice } from '../types/api-types';
import { fetchRootServicePaths, toChoices } from './api-helper';

/**
 * Fetch available API base paths (v2 and v6) and format them
 * into a list of prompt-friendly choices.
 *
 * Behavior:
 * - Calls {@link fetchRootServicePaths} for both `v2Endpoint` and `v6Endpoint`
 * - Normalizes all returned base paths
 * - Prefixes each path with `v2-` or `v6-` for selection values
 * - Groups results by version with non-selectable "separator" headers
 *
 * Example output:
 * ```ts
 * [
 *   { type: 'separator', line: '— API v2 —' },
 *   { name: '/iam', value: 'v2-/iam' },
 *   { name: '/cloud', value: 'v2-/cloud' },
 *   { type: 'separator', line: '— API v6 —' },
 *   { name: '/iam', value: 'v6-/iam' },
 *   { name: '/cloud/project', value: 'v6-/cloud/project' },
 * ]
 * ```
 *
 * This structure is designed for CLI prompt libraries such as Inquirer,
 * where `separator` entries render as non-selectable labels.
 *
 * @returns Promise resolving to an array of {@link ApiPathChoice} objects,
 *          including both v2 and v6 sections.
 */
export async function getApiPaths(): Promise<ApiPathChoice[]> {
  // Fetch both roots independently (in parallel)
  const [v2Paths, v6Paths] = await Promise.all([
    fetchRootServicePaths(v2Endpoint),
    fetchRootServicePaths(v6Endpoint),
  ]);

  return [
    { type: 'separator', line: '— API v2 —' },
    ...toChoices('v2', v2Paths),
    { type: 'separator', line: '— API v6 —' },
    ...toChoices('v6', v6Paths),
  ];
}
