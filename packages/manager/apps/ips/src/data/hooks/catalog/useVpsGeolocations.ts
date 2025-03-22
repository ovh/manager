import { useQuery } from '@tanstack/react-query';
import { ServiceType } from '@/types';
import { getVpsOrderableIpCountries } from '../../api';

export const getVpsGeolocationsQueryKey = (serviceName: string) => [
  ServiceType.vps,
  'geolocation',
  serviceName,
];

export const useVpsGeolocations = ({
  serviceName,
  enabled = true,
}: {
  serviceName: string;
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: getVpsGeolocationsQueryKey(serviceName),
    queryFn: () => getVpsOrderableIpCountries(serviceName),
    enabled,
  });
