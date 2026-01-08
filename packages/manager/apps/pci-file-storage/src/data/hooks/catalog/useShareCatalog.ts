import { useQuery } from '@tanstack/react-query';

import { getShareCatalog } from '@/data/api/catalog.api';
import { useProjectId } from '@/hooks/useProjectId';
import { shareCatalogQueryKey } from '@/adapters/catalog/queryKeys';

export const useShareCatalog = () => {
  const projectId = useProjectId();

  return useQuery({
    queryKey: shareCatalogQueryKey(projectId),
    queryFn: () => getShareCatalog(projectId),
  });
};
