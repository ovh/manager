import { useQuery } from '@tanstack/react-query';
import { getSubnetGateways } from '@/api/data/gateways';
import { queryKeyBuilder } from '@/utils/query';

export const useSubnetGateways = (
  projectId: string,
  region: string,
  subnetId: string,
) =>
  useQuery({
    queryKey: queryKeyBuilder(projectId, region, [
      'subnet',
      subnetId,
      'gateways',
    ]),
    queryFn: () => getSubnetGateways(projectId, region, subnetId),
    enabled: !!projectId && !!region && !!subnetId,
  });
