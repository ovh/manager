import { useQuery } from '@tanstack/react-query';
import { getFloatingIps } from '@/api/data/floating-ips';
import { queryKeyBuilder } from '@/utils/query';

export const useFloatingIps = (projectId: string, region?: string) =>
  useQuery({
    queryKey: queryKeyBuilder(projectId, region, ['floating-ips']),
    queryFn: () => getFloatingIps(projectId, region),
    enabled: !!region,
    select: (floatingIps) =>
      floatingIps.filter((floatingIp) => !floatingIp.associatedEntity),
  });
