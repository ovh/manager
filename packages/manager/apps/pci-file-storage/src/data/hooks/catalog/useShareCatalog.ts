import { useQuery } from '@tanstack/react-query';

import { shareCatalogQueryKey } from '@/adapters/catalog/queryKeys';
import { getShareCatalog } from '@/data/api/catalog.api';
import { TShareCatalog } from '@/domain/entities/catalog.entity';
import { useProjectId } from '@/hooks/useProjectId';
import { SelectOption } from '@/types/select-option';

export const useShareCatalog = <TData>(options?: SelectOption<TShareCatalog, TData>) => {
  const projectId = useProjectId();

  return useQuery<TShareCatalog, Error, TData>({
    queryKey: shareCatalogQueryKey(projectId),
    queryFn: () => getShareCatalog(projectId),
    select: options?.select,
    retry: 1,
    throwOnError: true,
  });
};
