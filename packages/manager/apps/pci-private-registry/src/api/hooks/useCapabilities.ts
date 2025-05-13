import { useQuery } from '@tanstack/react-query';
import { getCapabilities } from '@/api/data/capability';

export const useGetCapabilities = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'capabilities'],
    queryFn: () => getCapabilities(projectId),
  });
