import { QueryOptions, useQuery } from '@tanstack/react-query';
import getInstances, { Instance, getInstance } from '@/data/instance';

export const useInstance = (
  projectId: string,
  instanceId: string,
  opt?: QueryOptions<Instance>,
) =>
  useQuery({
    queryKey: ['project', projectId, 'instance', instanceId],
    queryFn: () => getInstance(projectId, instanceId),
    ...opt,
  });

export const useInstances = (
  projectId: string,
  opt?: QueryOptions<Instance[]>,
) =>
  useQuery({
    queryKey: ['project', projectId, 'instance'],
    queryFn: () => getInstances(projectId),
    ...opt,
  });

export default useInstances;
