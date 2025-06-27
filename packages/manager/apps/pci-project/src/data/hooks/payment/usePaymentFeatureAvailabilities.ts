import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { TPaymentFeatureAvailability } from '@/payment/constants';

export type TPaymentFeatureType = keyof typeof TPaymentFeatureAvailability;

export type TPaymentFeaturesState = {
  [k in TPaymentFeatureType]: boolean;
};

export type TPaymentFeatures = {
  features: TPaymentFeaturesState;
  isLoading: boolean;
};

/**
 * Custom hook that retrieves payment feature availabilities.
 *
 * This hook checks the availability of various payment features by querying
 * feature flags and returns their current state along with loading status.
 *
 * @returns An object containing:
 *   - `features`: A mapping of payment feature keys to their availability status (boolean)
 *   - `isLoading`: Boolean indicating whether the feature availability data is still being fetched
 *
 * @example
 * ```typescript
 * const { features, isLoading } = usePaymentFeatureAvailabilities();
 *
 * if (!isLoading && features.somePaymentFeature) {
 *   // Feature is available, show UI
 * }
 * ```
 */
export default (): TPaymentFeatures => {
  const featuresToCheck: string[] = Object.values(TPaymentFeatureAvailability);

  const { data: availability, isLoading } = useFeatureAvailability(
    featuresToCheck,
    {
      enabled: true,
    },
  );

  return {
    features: Object.fromEntries(
      Object.entries(TPaymentFeatureAvailability).map(([k, v]) => [
        k,
        availability?.[v] || false,
      ]),
    ) as TPaymentFeaturesState,
    isLoading,
  };
};
