import { useCallback } from 'react';

import { UseQueryResult, useQuery } from '@tanstack/react-query';

import type { Location } from '@ovh-ux/manager-react-shell-client';

import { useLocationsQueryOptions } from '../useLocationsQueryOptions/useLocationsQueryOptions';

export const useCityByCode = (code: string): UseQueryResult<string | undefined> => {
  const select = useCallback(
    (locations: Location[]) =>
      locations.find((location: Location) => location.cityCode === code)?.cityName,
    [code],
  );
  const options = useLocationsQueryOptions();
  return useQuery({ ...options, select });
};
