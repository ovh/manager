import { useQuery } from '@tanstack/react-query';

import { ServiceType } from '@/types';

import { getDedicatedServerAvailableCountries } from '../../api';

export const getDedicatedServerGeolocationsQueryKey = (
  serviceName?: string | null,
) => [ServiceType.server, 'geolocation', serviceName];

export const useDedicatedServerGeolocations = ({
  serviceName,
  enabled = true,
}: {
  serviceName?: string | null;
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: getDedicatedServerGeolocationsQueryKey(serviceName),
    queryFn: () => getDedicatedServerAvailableCountries(serviceName),
    enabled,
  });
