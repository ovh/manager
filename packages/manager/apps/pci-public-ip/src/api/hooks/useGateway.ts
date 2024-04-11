import { useQuery } from '@tanstack/react-query';
import { getGatewayDetails } from '@/api/data/gateway';

export const useGatewayDetails = (
  projectId: string,
  region: string,
  gatewayId: string,
) =>
  useQuery({
    queryKey: [
      'projectId',
      projectId,
      'region',
      region,
      'gatewayId',
      gatewayId,
    ],
    queryFn: () => getGatewayDetails(projectId, region, gatewayId),
    enabled: !!projectId && !!region && !!gatewayId,
    throwOnError: true,
  });
