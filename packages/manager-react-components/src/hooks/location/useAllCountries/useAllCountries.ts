import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Location } from '@ovh-ux/shell';
import { Country } from './useAllCountries.type';
import { useLocationsQueryOptions } from '../useLocationsQueryOptions';

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
