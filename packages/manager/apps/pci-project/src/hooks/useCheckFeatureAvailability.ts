import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { TFeatureStateDetail } from '@/constants';

export type TFeatureAvailabilityState = {
  available: boolean;
  feature: string;
  check: boolean;
};

/**
 * Hook that checks if a feature is available based on the provided feature state.
 *
 * @param featureState - The feature state detail containing feature availability information
 * @returns An object containing:
 *   - `available`: Boolean indicating if the feature is available
 *   - `feature`: The feature identifier string
 *   - `check`: Boolean indicating if the availability check was performed
 *
 * @example
 * ```typescript
 * const { available, feature, check } = useCheckFeatureAvailability(featureState);
 * if (available) {
 *   // Feature is available, proceed with feature logic
 * }
 * ```
 */
export default (
  featureState: TFeatureStateDetail | undefined,
): TFeatureAvailabilityState => {
  const feature: string | undefined = featureState?.featureAvailability;
  const check = !!feature;

  if (!feature) {
    return { available: false, feature: '', check: false };
  }

  const { data: availability } = useFeatureAvailability([feature], {
    enabled: check,
  });

  return { available: availability?.[feature] || false, feature, check };
};
