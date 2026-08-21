import { useQuery } from '@tanstack/react-query';

import { getNetworkCatalog } from '@/api/data/network-catalog';

export const getNetworkCatalogQueryKey = (projectId: string) => ['network-catalog', projectId];

export const useNetworkCatalog = (projectId: string, enabled = true) =>
  useQuery({
    queryKey: getNetworkCatalogQueryKey(projectId),
    queryFn: () => getNetworkCatalog(projectId),
    enabled: !!projectId && enabled,
  });
