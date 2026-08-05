import { useQuery } from '@tanstack/react-query';
import {
  getAllProjectGateways,
  getProjectGatewaysUrl,
} from '@/api/data/project-gateways';

export const getProjectGatewaysQuery = (projectId: string) => ({
  queryKey: [getProjectGatewaysUrl(projectId)],
  queryFn: () => getAllProjectGateways(projectId),
});

export const useProjectGateways = (projectId: string) => {
  return useQuery({
    ...getProjectGatewaysQuery(projectId),
  });
};
