import { useQuery } from '@tanstack/react-query';
import { getInstance, getInstances } from '../data/instance';

export const useInstance = (projectId: string, instanceId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'instances', instanceId],
    queryFn: async () => getInstance(projectId, instanceId),
    enabled: !!instanceId,
  });

export const getInstancesQuery = (projectId: string) => ({
  queryKey: ['project', projectId, 'instances'],
  queryFn: () => getInstances(projectId),
});

export const useInstances = (projectId: string) =>
  useQuery({
    ...getInstancesQuery(projectId),
  });
