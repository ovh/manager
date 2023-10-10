import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@ovh-ux/manager-core-api';

export const featureAvailabilityBaseQueryKey = 'feature-availability-';

export type UseFeatureAvailabilityParams = {
  parent: string;
  featureList?: string[];
};

const getFeaturesListToCheck = ({
  parent,
  featureList = [],
}: UseFeatureAvailabilityParams) =>
  [parent].concat(featureList.map((name) => `${parent}:${name}`));

/**
 * @example
 * const {data, error, loading} = useFeatureAvailability(
 *   {parent: 'dedicated-nasha', featureList: ['feature1', 'feature2']},
 *   {parent: 'app2'},
 *   {parent: 'app3', featureList: ['feat1']}
 * );
 * const isAppAvailable = data.['dedicated-nasha'];
 * const isFeature1Available = data.feature1;
 * const isFeature2Available = data.feature2;
 * const isApp2Available = data.app2;
 * const isApp3Available = data.app3;
 * const isApp3Feature1Available = data.feat1;
 */
export const useFeatureAvailability = (
  ...featureList: UseFeatureAvailabilityParams[]
) => {
  const featuresListToCheck = featureList.flatMap(getFeaturesListToCheck);

  const fetchFeatureAvailabilityData = async () => {
    const result = await apiClient.aapi.get(
      `/feature/${featuresListToCheck.join(',')}/availability`,
    );
    return result.data || {};
  };

  return useQuery<Record<string, boolean>>(
    [`${featureAvailabilityBaseQueryKey}-${featuresListToCheck.join('-')}`],
    fetchFeatureAvailabilityData,
  );
};
