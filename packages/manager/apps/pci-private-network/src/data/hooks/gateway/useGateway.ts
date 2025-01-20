import { useQuery } from '@tanstack/react-query';
import { getGatewaysByRegion } from '@/data/api/gateway';

export const useGatewaysByRegion = (projectId: string, region: string) =>
  useQuery({
    queryKey: ['project', projectId, 'region', region, 'gateway'],
    queryFn: () => getGatewaysByRegion(projectId, region),
    enabled: !!region,
    select: (gateways) =>
      gateways.map((gateway) => ({
        ...gateway,
        region,
      })),
  });
