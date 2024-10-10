import { useQuery } from '@tanstack/react-query';
import { getFloatingIps, getRegionPrivateNetworks } from '../data/region';

export const useGetFloatingIps = (projectId: string, region: string) =>
  useQuery({
    queryKey: ['project', projectId, 'region', region, 'floating-ips'],
    queryFn: () => getFloatingIps(projectId, region),
    enabled: !!projectId && !!region,
    throwOnError: true,
  });

export const useGetRegionNetworks = (projectId: string, region: string) =>
  useQuery({
    queryKey: ['project', projectId, 'region', region, 'networks'],
    queryFn: () => getRegionPrivateNetworks(projectId, region),
    enabled: !!projectId && !!region,
    throwOnError: true,
  });
