import { useQuery } from '@tanstack/react-query';
import { getFloatingIps } from '../data/floating-ips';

export const useGetFloatingIps = (projectId: string, region: string) =>
  useQuery({
    queryKey: ['project', projectId, 'region', region, 'floating-ips'],
    queryFn: () => getFloatingIps(projectId, region),
    enabled: !!projectId && !!region,
    throwOnError: true,
  });
