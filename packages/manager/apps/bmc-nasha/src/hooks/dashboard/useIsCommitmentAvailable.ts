import { useFeatureAvailability } from '@ovh-ux/manager-module-common-api';

const FEATURE_ID = 'billing:commitment';

/**
 * Hook to check if commitment feature is available
 * Equivalent to isCommitmentAvailable resolve in dashboard.routing.js
 */
export function useIsCommitmentAvailable() {
  const { data: features } = useFeatureAvailability([FEATURE_ID]);

  return features?.[FEATURE_ID] ?? false;
}
