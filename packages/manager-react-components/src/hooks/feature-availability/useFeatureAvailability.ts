import { useContext } from 'react';
import { AxiosInstance } from 'axios';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { ManagerReactComponentContext } from '../../context/ManagerReactComponentsContext';
import { ApiError } from '../useCoreApiClient';
import ShellClient from '../../context/shell-client';

export type UseFeatureAvailabilityResult<
  T = Record<string, boolean>
> = UseQueryResult<T, ApiError>;

export const fetchFeatureAvailabilityData = async <T extends string[]>(
  featureList: [...T],
  apiClient: Record<string, AxiosInstance>,
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
) => [`feature-availability-${featureList.join('-')}`];

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
): UseFeatureAvailabilityResult<Record<
  typeof featureList[number],
  boolean
>> => {
  const context = useContext(ManagerReactComponentContext);
  const { apiClient } = context;
  return useQuery<Record<typeof featureList[number], boolean>, ApiError>({
    queryKey: getFeatureAvailabilityQueryKey(featureList),
    queryFn: () => fetchFeatureAvailabilityData(featureList, apiClient),
    retry: false,
  });
};
