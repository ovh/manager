import { useQuery } from '@tanstack/react-query';
import { getVolumeCatalog } from '@/api/data/catalog';

export const useVolumeCatalog = (projectId: string) =>
  useQuery({
    queryKey: ['projects', projectId, 'catalog', 'volume'],
    queryFn: () => getVolumeCatalog(projectId),
  });
