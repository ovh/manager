import { useQuery } from '@tanstack/react-query';
import { getInstances, getInstancesUrl } from '@/api/data/instances';

export const getInstancesQuery = (projectId: string) => ({
  queryKey: [getInstancesUrl(projectId)],
  queryFn: () => getInstances(projectId),
});

export const useInstances = (projectId: string) => {
  return useQuery({
    ...getInstancesQuery(projectId),
  });
};
