import { queryOptions, useQuery } from '@tanstack/react-query';
import { getSubnets, getSubnetsUrl } from '@/api/data/subnets';

const getSubnetsQuery = (
  projectId: string,
  region: string,
  networkId: string,
) =>
  queryOptions({
    queryKey: [getSubnetsUrl(projectId, region, networkId)],
    queryFn: () => getSubnets(projectId, region, networkId),
    enabled: !!projectId && !!region && !!networkId,
  });

export const useSubnets = (
  projectId: string,
  region: string,
  networkId: string,
) => {
  return useQuery({
    ...getSubnetsQuery(projectId, region, networkId),
  });
};
