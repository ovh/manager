import { apiClient } from '@ovh-ux/manager-core-api';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

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
): UseQueryResult<Record<string, boolean>, unknown> => {
  const fetchFeatureAvailabilityData = async () => {
    const result = await apiClient.aapi.get(
      `/feature/${featureList.join(',')}/availability`,
    );

    const features: Record<string, boolean> = {};
    featureList.forEach((feature) => {
      features[feature] = feature in result.data ? result.data[feature] : false;
    });

    return features;
  };

  return useQuery<Record<string, boolean>>({
    queryKey: [featureList.join('-')],
    queryFn: fetchFeatureAvailabilityData,
  });
};
