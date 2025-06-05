import { useCallback } from 'react';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Location } from '@ovh-ux/shell';
import { LocationType } from './useAllLocationsByType.type';
import { useLocationsQueryOptions } from '../useLocationsQueryOptions';

export const useAllLocationsByType = (
  type: LocationType,
): UseQueryResult<Location[]> => {
  const select = useCallback(
    (locations: Location[]) =>
      locations.filter((location: Location) => location.type === type),
    [type],
  );
  const options = useLocationsQueryOptions();
  return useQuery({ ...options, select });
};
