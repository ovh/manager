import { useQuery } from '@tanstack/react-query';
import { getAllInstance } from '@/api/data/instance';

export const useAllInstance = (projectId: string) => {
  return useQuery({
    queryKey: ['project', projectId, 'instance'],
    queryFn: () => getAllInstance(projectId),
  });
};
