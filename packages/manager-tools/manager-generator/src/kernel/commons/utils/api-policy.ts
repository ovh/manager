/**
 * @file api-policy.ts
 * @description Central policy for selecting listing/onboarding API flavors.
 */

/**
 * Inputs to the API selection policy.
 */
export interface ApiSelectionInputs {
  /**
   * True if any v6 GET operations exist for the chosen services.
   */
  hasV6: boolean;

  /**
   * True if any v2 GET operations exist for the chosen services.
   */
  hasV2: boolean;

  /**
   * Which API version the selected listing endpoint belongs to (membership).
   * If unknown, treat as 'v6' to match legacy/default behavior.
   */
  listingBelongsTo?: 'v2' | 'v6';
}

/**
 * Outputs from the API selection policy.
 */
export interface ApiSelectionResult {
  /**
   * API flavor used by listing/datagrid layer.
   * - Prefer 'v6Iceberg' whenever v6 exists.
   * - Otherwise 'v2' if only v2 exists.
   * - Fallback 'v6Iceberg' when neither list is present.
   */
  listingApi: 'v6Iceberg' | 'v2' | 'v6';

  /**
   * API flavor used by onboarding flows (form actions etc.).
   * - Mirrors the version where the selected listing endpoint actually belongs.
   */
  onboardingApi: 'v2' | 'v6';
}

/**
 * Decide which APIs to use for listing and onboarding.
 *
 * Rules (mirrors your test scenarios):
 * - If *any* v6 GET exists → listingApi = 'v6Iceberg'
 * - Else if only v2 exists → listingApi = 'v2'
 * - Else (no ops in v2/v6 lists) → listingApi = 'v6Iceberg' (default)
 * - Onboarding follows the version that the selected listing endpoint belongs to.
 *
 * @param inputs Policy inputs (presence flags + membership).
 * @returns The selected listingApi and onboardingApi.
 *
 * @example
 * chooseApis({ hasV6: true, hasV2: false, listingBelongsTo: 'v6' })
 * // => { listingApi: 'v6Iceberg', onboardingApi: 'v6' }
 *
 * @example
 * chooseApis({ hasV6: true, hasV2: true, listingBelongsTo: 'v2' })
 * // => { listingApi: 'v6Iceberg', onboardingApi: 'v2' }
 *
 * @example
 * chooseApis({ hasV6: false, hasV2: false })
 * // => { listingApi: 'v6Iceberg', onboardingApi: 'v6' }
 */
export function chooseApis(inputs: ApiSelectionInputs): ApiSelectionResult {
  const hasV6 = inputs.hasV6;
  const hasV2 = inputs.hasV2;

  const listingApi: 'v6Iceberg' | 'v2' | 'v6' = hasV6 ? 'v6Iceberg' : hasV2 ? 'v2' : 'v6Iceberg';

  // Default onboarding membership to v6 when unknown (keeps prior behavior identical)
  const onboardingApi: 'v2' | 'v6' = inputs.listingBelongsTo ?? 'v6';

  return { listingApi, onboardingApi };
}
