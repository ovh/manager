import { useCallback } from 'react';

import { UseQueryResult, useQuery } from '@tanstack/react-query';

import type {
  Location,
  LocationType as ShellLocationType,
} from '@ovh-ux/manager-react-shell-client';

import { useLocationsQueryOptions } from '../useLocationsQueryOptions/useLocationsQueryOptions';
import { LocationType } from './useAllLocationsByType.type';

export const useAllLocationsByType = (type: LocationType): UseQueryResult<Location[]> => {
  const select = useCallback(
    (locations: Location[]) =>
      locations.filter((location: Location) => location.type === (type as ShellLocationType)),
    [type],
  );
  const options = useLocationsQueryOptions();
  return useQuery({ ...options, select });
};
