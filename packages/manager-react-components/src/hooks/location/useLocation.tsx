import { useCallback, useContext } from 'react';
import { queryOptions, useQuery, UseQueryResult } from '@tanstack/react-query';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { Country, Location, LocationType } from './location.type';

const useLocationsQueryOptions = () => {
  const {
    shell: { location },
  } = useContext(ShellContext);
  return queryOptions({
    queryKey: ['shell', 'getLocations'],
    queryFn: () => Promise.resolve(location.getLocations()),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    retry: 3,
    retryDelay: 5000,
  });
};

export const useLocationByName = (name: string): UseQueryResult<Location> => {
  const select = useCallback(
    (locations: Location[]) =>
      locations.find((location: Location) => location.name === name),
    [name],
  );
  const options = useLocationsQueryOptions();
  return useQuery({ ...options, select });
};

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

export const useAllCountries = (): UseQueryResult<Country[]> => {
  const options = useLocationsQueryOptions();
  return useQuery({ ...options, select: extractUniqueCountries });
};
