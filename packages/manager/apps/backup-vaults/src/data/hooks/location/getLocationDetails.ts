import { useQuery } from '@tanstack/react-query';

import { getLocationDetails } from '@/data/api/location/location.requests';

export const LOCATION_QUERY_KEYS = {
  location: ['location'],
  locationByName: (locationName: string) => ['location', locationName],
};

export const useLocationDetails = (locationName: string) =>
  useQuery({
    queryKey: LOCATION_QUERY_KEYS.locationByName(locationName),
    queryFn: () => getLocationDetails(locationName),
  });
