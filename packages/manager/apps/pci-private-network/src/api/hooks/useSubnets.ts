import { useQuery } from '@tanstack/react-query';
import { getSubnets } from '@/api/data/subnets';

export const useSubnets = (
  projectId: string,
  networkId: string,
  region: string,
) =>
  useQuery({
    queryKey: ['project', projectId, 'region', region, 'networkId', networkId],
    queryFn: () => getSubnets(projectId, networkId, region),
  });
