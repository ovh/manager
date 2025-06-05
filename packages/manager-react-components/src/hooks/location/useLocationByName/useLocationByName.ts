import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Location } from '@ovh-ux/shell';
import { useLocationsQueryOptions } from '../useLocationsQueryOptions';

export const useLocationByName = (name: string): UseQueryResult<Location> => {
  const select = useCallback(
    (locations: Location[]) =>
      locations.find((location: Location) => location.name === name),
    [name],
  );
  const options = useLocationsQueryOptions();
  return useQuery({ ...options, select });
};
