import { apiClient, ApiError } from '@ovh-ux/manager-core-api';
import {
  DefinedInitialDataOptions,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';

export type UseFeatureAvailabilityResult<
  T = Record<string, boolean>
> = UseQueryResult<T, ApiError>;

export const fetchFeatureAvailabilityData = async <T extends string[]>(
  featureList: [...T],
) => {
  const result = await apiClient.aapi.get(
    `/feature/${featureList.join(',')}/availability`,
  );

  const features = {} as Record<typeof featureList[number], boolean>;
  featureList.forEach((feature) => {
    features[feature] = feature in result.data ? result.data[feature] : false;
  });

  return features;
};

export const getFeatureAvailabilityQueryKey = <T extends string[]>(
  featureList: [...T],
) => ['feature-availability', ...featureList];

/**
 * @examples
 * const featureList = ['billing', 'webooo', 'web:microsoft'];
 *
 * const { data, error, isLoading } = useFeatureAvailability(featureList);
 * const isBillingAvailable = data?.billing;
 * const isWebooooAvailable = data?.webooo;
 * const isMicrosoftAvailable = data.['web:microsoft'];
 */
export const useFeatureAvailability = <T extends string[]>(
  featureList: [...T],
  options: Partial<
    DefinedInitialDataOptions<
      Record<typeof featureList[number], boolean>,
      ApiError
    >
  > = {},
): UseFeatureAvailabilityResult<Record<typeof featureList[number], boolean>> =>
  useQuery<Record<typeof featureList[number], boolean>, ApiError>({
    queryKey: getFeatureAvailabilityQueryKey(featureList),
    queryFn: () => fetchFeatureAvailabilityData(featureList),
    ...options,
  });
