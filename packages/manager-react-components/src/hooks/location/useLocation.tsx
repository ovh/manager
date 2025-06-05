import { useCallback, useContext } from 'react';
import { queryOptions, useQuery, UseQueryResult } from '@tanstack/react-query';
import { Location } from '@ovh-ux/shell';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export enum LocationType {
  '1AZ' = 'REGION-1-AZ',
  '3AZ' = 'REGION-3-AZ',
  'LZ' = 'LOCAL-ZONE',
}

export type Country = {
  code: string;
  name: string;
};

const useLocationsQueryOptions = () => {
  const {
    shell: { location },
  } = useContext(ShellContext);
  return queryOptions({
    queryKey: ['shell', 'getLocations'],
    queryFn: async () => await location.getLocations(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });
};

export const getLocationByName = (name: string): UseQueryResult<Location> => {
  const select = useCallback(
    (locations: Location[]) =>
      locations.find((location: Location) => location.name === name),
    [name],
  );
  const options = useLocationsQueryOptions();
  return useQuery({ ...options, select });
};

export const getAllLocationsByType = (
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

export const getCityByCode = (code: string): UseQueryResult<string> => {
  const select = useCallback(
    (locations: Location[]) =>
      locations.find((location: Location) => location.cityCode === code)
        ?.cityName,
    [code],
  );
  const options = useLocationsQueryOptions();
  return useQuery({ ...options, select });
};

function extractUniqueCountries(locations: Location[]) {
  const set = new Set();
  return locations.reduce((countries: Country[], location: Location) => {
    // Ensuring uniqueness by checking if country was already computed
    if (!set.has(location.countryCode)) {
      countries.push({
        code: location.countryCode,
        name: location.countryName,
      });
      set.add(location.countryCode);
    }
    return countries;
  }, []);
}

export const getAllCountries = (): UseQueryResult<Country[]> => {
  const options = useLocationsQueryOptions();
  return useQuery({ ...options, select: extractUniqueCountries });
};
