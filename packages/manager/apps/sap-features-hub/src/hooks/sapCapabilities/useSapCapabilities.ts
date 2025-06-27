import { useQuery } from '@tanstack/react-query';
import { getSapCapabilities } from '@/data/api/sapCapabilities';

export const useSapCapabilities = (serviceName: string) =>
  useQuery({
    queryKey: ['applicationVersions', serviceName],
    queryFn: () => getSapCapabilities(serviceName),
    select: (res) => res.data,
    enabled: !!serviceName,
  });
