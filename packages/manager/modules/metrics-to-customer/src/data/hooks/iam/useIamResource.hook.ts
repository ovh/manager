import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { getResource } from '@/data/api/iam.api';
import { IamResourcesResponse } from '@/types/iam.type';
import { useLocation } from '@/data/hooks/locations/useLocations.hook';

export const getIamResourceQueryKey = (resourceURN: string) => [
  'resourceURN',
  resourceURN,
];

export const useIamResource = (
  resourceURN: string,
  options?: Omit<
    UseQueryOptions<IamResourcesResponse, Error>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: getIamResourceQueryKey(resourceURN),
    queryFn: ({ signal }) => getResource({ resourceURN, signal }),
    enabled: !!resourceURN,
    ...options,
  });
};

export const useIamResourceRegion = (resourceURN: string) => {
  const { data, isLoading, isFetching, error, isSuccess } = useIamResource(
    resourceURN,
  );

  const resource = data?.[0];
  const region = resource?.tags?.['ovh:region'];
  const notFound = isSuccess && !region;

  return {
    data: region,
    resource,
    isLoading: isLoading || isFetching,
    isSuccess: isSuccess && !!region,
    isError: !!error || notFound,
    error: error ?? (notFound ? new Error(`Region not found in IAM resource tags for URN "${resourceURN}".`) : null),
  };
};

export const useIamResourceLocation = (resourceURN: string) => {
  const {
    data: region,
    resource,
    isLoading: isRegionLoading,
    error: regionError,
  } = useIamResourceRegion(resourceURN);

  const {
    data: location,
    isLoading: isLocationLoading,
    isSuccess,
    isError: isLocationError,
    error: locationError,
  } = useLocation(region || '');

  return {
    data: location,
    region,
    resource,
    isLoading: isRegionLoading || isLocationLoading,
    isSuccess,
    isError: !!regionError || isLocationError,
    error: regionError || locationError,
  };
};
