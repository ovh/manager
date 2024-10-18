import { useQuery } from '@tanstack/react-query';
import { getSubnetGateways } from '@/api/data/gateways';

export const useGetSubnetGateways = (
  projectId: string,
  regionName: string,
  subnetId: string,
) =>
  useQuery({
    queryKey: [
      'project',
      projectId,
      'region',
      regionName,
      'subnet',
      subnetId,
      'gateways',
    ],
    queryFn: () => getSubnetGateways(projectId, regionName, subnetId),
    enabled: !!projectId && !!regionName && !!subnetId,
    throwOnError: true,
  });
