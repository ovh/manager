import { useQuery } from '@tanstack/react-query';
import { getInstance } from '@/api/data/instance';

export const useInstance = (projectId: string, instanceId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'instance', instanceId],
    queryFn: () => getInstance(projectId, instanceId),
  });
