import { useQuery } from '@tanstack/react-query';
import { getInstances } from '../data/instance';

export const getInstancesQuery = (projectId: string, region?: string) => ({
  queryKey: ['instances', projectId, region],
  queryFn: () => getInstances(projectId, region),
});

export const useInstances = (projectId: string, region?: string) =>
  useQuery({
    ...getInstancesQuery(projectId, region),
  });
