import { useQuery } from '@tanstack/react-query';
import { getGateways, getGatewaysUrl } from '@/api/data/gateways';

export const getGatewaysQuery = (projectId: string, ipRegion: string) => ({
  queryKey: [getGatewaysUrl(projectId, ipRegion)],
  queryFn: () => getGateways(projectId, ipRegion),
});

export const useGateways = (projectId: string, ipRegion: string) => {
  return useQuery({
    ...getGatewaysQuery(projectId, ipRegion),
    enabled: !!projectId && !!ipRegion,
  });
};
