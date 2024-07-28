import { useQuery } from '@tanstack/react-query';
import { getInstances } from '@/api/data/instance';

export const useInstances = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'instances'],
    queryFn: () => getInstances(projectId),
    enabled: !!projectId,
    throwOnError: true,
  });
