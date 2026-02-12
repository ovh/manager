import { queryOptions } from '@tanstack/react-query';

import { getLocationDetails } from '@/data/api/locations/location.requests';

import { queryKeys } from './queryKeys';

// ─── Base queries (no QueryClient needed) ───

const detail = (locationName: string) =>
  queryOptions({
    queryKey: queryKeys.locations.detail(locationName),
    queryFn: () => getLocationDetails(locationName),
    enabled: !!locationName,
  });

// ─── Factory ───

export const locationsQueries = { detail };
