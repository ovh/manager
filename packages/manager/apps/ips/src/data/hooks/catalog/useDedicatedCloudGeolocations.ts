import { useQuery } from '@tanstack/react-query';
import { ServiceType } from '@/types';
import { getDedicatedCloudOrderableIpCountries } from '../../api/dedicated-cloud';

export const getDedicatedCloudGeolocationsQueryKey = (serviceName: string) => [
  ServiceType.dedicatedCloud,
  'geolocation',
  serviceName,
];

export const useDedicatedCloudGeolocations = ({
  serviceName,
  enabled = true,
}: {
  serviceName: string;
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: getDedicatedCloudGeolocationsQueryKey(serviceName),
    queryFn: () => getDedicatedCloudOrderableIpCountries(serviceName),
    enabled,
  });
