import { useQuery } from '@tanstack/react-query';
import { getVolumeCatalog } from '@/data/api/catalog';

export const useVolumeCatalog = (projectId: string) =>
  useQuery({
    queryKey: ['projects', projectId, 'catalog', 'volume'],
    queryFn: () => getVolumeCatalog(projectId),
  });
