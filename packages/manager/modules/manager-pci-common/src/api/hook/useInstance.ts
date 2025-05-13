import { useQuery } from '@tanstack/react-query';
import { getInstance, getInstances } from '../data/instance';

export const useInstance = (projectId: string, instanceId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'instances', instanceId],
    queryFn: async () => getInstance(projectId, instanceId),
    enabled: !!instanceId,
  });

export const getInstancesQuery = (projectId: string, region?: string) => ({
  queryKey: ['instances', projectId, region],
  queryFn: () => getInstances(projectId, region),
});

export const useInstances = (projectId: string, region?: string) =>
  useQuery({
    ...getInstancesQuery(projectId, region),
  });
