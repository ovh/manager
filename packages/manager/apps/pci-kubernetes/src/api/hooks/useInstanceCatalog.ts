import { useQuery } from '@tanstack/react-query';

import { getInstanceCatalog } from '@/api/data/instance-catalog';

export const getInstanceCatalogQueryKey = (projectId: string) => ['instance-catalog', projectId];

export const useInstanceCatalog = (projectId: string, enabled = true) =>
  useQuery({
    queryKey: getInstanceCatalogQueryKey(projectId),
    queryFn: () => getInstanceCatalog(projectId),
    enabled: !!projectId && enabled,
  });
