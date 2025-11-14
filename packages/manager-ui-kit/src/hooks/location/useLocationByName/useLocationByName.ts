import { useCallback } from 'react';

import { UseQueryResult, useQuery } from '@tanstack/react-query';

import type { Location } from '@ovh-ux/manager-react-shell-client';

import { useLocationsQueryOptions } from '../useLocationsQueryOptions/useLocationsQueryOptions';

export const useLocationByName = (name: string): UseQueryResult<Location | undefined> => {
  const select = useCallback(
    (locations: Location[]) => locations.find((location: Location) => location.name === name),
    [name],
  );
  const options = useLocationsQueryOptions();
  return useQuery({ ...options, select });
};
