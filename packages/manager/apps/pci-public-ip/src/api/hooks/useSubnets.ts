import { useQuery } from '@tanstack/react-query';
import { getSubnets, getSubnetsUrl } from '@/api/data/subnets';

export const getSubnetsQuery = (projectId: string, networkId: string) => ({
  queryKey: [getSubnetsUrl(projectId, networkId)],
  queryFn: () => getSubnets(projectId, networkId),
});

export const useSubnets = (projectId: string, networkId: string) => {
  return useQuery({
    ...getSubnetsQuery(projectId, networkId),
    enabled: !!projectId && !!networkId,
  });
};
