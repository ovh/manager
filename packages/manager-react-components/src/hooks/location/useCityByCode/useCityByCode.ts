import { useCallback } from 'react';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Location } from '@ovh-ux/shell';
import { useLocationsQueryOptions } from '../useLocationsQueryOptions';

export const useCityByCode = (code: string): UseQueryResult<string> => {
  const select = useCallback(
    (locations: Location[]) =>
      locations.find((location: Location) => location.cityCode === code)
        ?.cityName,
    [code],
  );
  const options = useLocationsQueryOptions();
  return useQuery({ ...options, select });
};
