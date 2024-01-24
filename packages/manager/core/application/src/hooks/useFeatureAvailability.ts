import { apiClient } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';

/**
 * @example
 * const { data, isLoading } = useFeatureAvailability([
    'billing:administrativeMandate',
    'billing:commitment',
    'billing:billingServices',
    'billing:titi',
    'web:microsoft',
  ]);
 */

export const useFeatureAvailability = (featureList) => {
  const fetchFeatureAvailabilityData = async () => {
    const result = await apiClient.aapi.get(
      `/feature/${featureList.join(',')}/availability`,
    );

    return result.data || {};
  };

  return useQuery([featureList.join('-')], fetchFeatureAvailabilityData);
};
