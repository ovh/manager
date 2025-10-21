import { useMemo } from 'react';

import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { getInfrastructures } from '@/__mocks__/infrastructures/infrastructures.adapter';
import { InfrastructuresParams } from '@/data/api/infrastructures.props';
import { Infrastructure } from '@/types/infrastructures.type';

import { useLocations } from './useLocations.hook';

export const getInfrastructuresQueryKey = ({
  resourceName,
  usages,
  types,
}: Omit<InfrastructuresParams, 'signal'>) => ['infrastructures', resourceName, usages, types];

export const useInfrastructures = (
  { resourceName, usages, types }: Omit<InfrastructuresParams, 'signal'>,
  queryOptions?: Omit<UseQueryOptions<Infrastructure[], Error>, 'queryKey' | 'queryFn'>,
) => {
  const {
    data: locations,
    isLoading: isLocationsLoading,
    error: locationsError,
    isSuccess: isLocationsSuccess,
  } = useLocations();

  const {
    data: infrastructures,
    isLoading,
    error,
    isSuccess,
    refetch,
  } = useQuery<Infrastructure[], Error>({
    queryKey: getInfrastructuresQueryKey({ resourceName, usages, types }),
    queryFn: ({ signal }) => getInfrastructures({ resourceName, signal, usages, types }),
    enabled: !!resourceName,
    ...queryOptions,
  });

  // Enrich infrastructures data with location information
  const infrastructuresWithLocation = useMemo(() => {
    if (!infrastructures || !locations?.length) {
      return infrastructures;
    }

    return infrastructures.map((infrastructure) => {
      const location = locations.find(({ name }) => name === infrastructure.currentState.location);
      return {
        ...infrastructure,
        locationDetails: location,
      };
    });
  }, [infrastructures, locations]);

  return {
    data: infrastructuresWithLocation,
    isLoading: isLoading || isLocationsLoading,
    error: error || locationsError,
    isError: !!(error || locationsError),
    isSuccess: isSuccess && isLocationsSuccess,
    refetch,
  };
};
