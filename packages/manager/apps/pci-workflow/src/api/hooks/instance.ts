import { useQuery } from '@tanstack/react-query';
import { getInstance } from '@/api/data/instance';

export const useInstance = (projectId: string, instanceId: string) =>
  useQuery({
    queryKey: ['instances', instanceId],
    queryFn: async () => getInstance(projectId, instanceId),
    enabled: !!instanceId,
  });
