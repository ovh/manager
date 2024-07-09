import { apiClient, ApiError } from '@ovh-ux/manager-core-api';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

const fetchFeatureAvailabilityData = async (featureList: string[] = []) => {
  const result = await apiClient.aapi.get(
    `/feature/${featureList.join(',')}/availability`,
  );

  const features: Record<string, boolean> = {};
  featureList.forEach((feature) => {
    features[feature] = feature in result.data ? result.data[feature] : false;
  });

  return features;
};

export const getFeatureAvailabilityQueryKey = (featureList: string[]) => [
  `feature-availability-${featureList.join('-')}`,
];

export type UseFeatureAvailabilityResult = UseQueryResult<
  Record<string, boolean>,
  ApiError
>;

/**
 * @examples
 * const featureList = ['billing', 'webooo', 'web:microsoft'];
 *
 * const { data, error, isLoading } = useFeatureAvailability(featureList);
 * const isBillingAvailable = data?.billing;
 * const isWebooooAvailable = data?.webooo;
 * const isMicrosoftAvailable = data.['web:microsoft'];
 */
export const useFeatureAvailability = (
  featureList: string[],
): UseFeatureAvailabilityResult =>
  useQuery<Record<string, boolean>, ApiError>({
    queryKey: getFeatureAvailabilityQueryKey(featureList),
    queryFn: () => fetchFeatureAvailabilityData(featureList),
    retry: false,
  });
