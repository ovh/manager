import { DefinedInitialDataOptions, UseQueryResult, useQuery } from '@tanstack/react-query';

import { ApiError, apiClient } from '@ovh-ux/manager-core-api';

export type UseFeatureAvailabilityResult<T = Record<string, boolean>> = UseQueryResult<T, ApiError>;

export const fetchFeatureAvailabilityData = async <T extends string[]>(featureList: [...T]) => {
  const result = await apiClient.aapi.get(`/feature/${featureList.join(',')}/availability`);

  const features = {} as Record<(typeof featureList)[number], boolean>;
  const data: unknown = result.data;

  if (typeof data === 'object' && data !== null) {
    const record = data as Record<string, unknown>;
    featureList.forEach((feature) => {
      features[feature] = record[feature] === true;
    });
  }

  return features;
};

export const getFeatureAvailabilityQueryKey = <T extends string[]>(featureList: [...T]) => [
  'feature-availability',
  ...featureList,
];

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
    DefinedInitialDataOptions<Record<(typeof featureList)[number], boolean>, ApiError>
  > = {},
): UseFeatureAvailabilityResult<Record<(typeof featureList)[number], boolean>> =>
  useQuery<Record<(typeof featureList)[number], boolean>, ApiError>({
    queryKey: getFeatureAvailabilityQueryKey(featureList),
    queryFn: () => fetchFeatureAvailabilityData(featureList),
    ...options,
  });
