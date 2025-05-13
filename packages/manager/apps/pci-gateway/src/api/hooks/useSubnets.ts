import { useQuery } from '@tanstack/react-query';
import { getSubnets, getSubnetsUrl, TSubnet } from '@/api/data/subnets';

export const getSubnetsQuery = (
  projectId: string,
  regionName: string,
  networkId: string,
) => ({
  queryKey: [getSubnetsUrl(projectId, regionName, networkId)],
  queryFn: (): Promise<TSubnet[]> =>
    networkId === 'new'
      ? Promise.resolve([])
      : getSubnets(projectId, regionName, networkId),
});

export const useSubnets = (
  projectId: string,
  regionName: string,
  networkId: string,
) =>
  useQuery({
    ...getSubnetsQuery(projectId, regionName, networkId),
    enabled: !!projectId && !!regionName && !!networkId,
  });
