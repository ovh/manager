import { useQuery } from '@tanstack/react-query';

import { getShareCatalog } from '@/data/api/catalog.api';
import { useProjectId } from '@/hooks/useProjectId';
import { shareCatalogQueryKey } from '@/adapters/catalog/queryKeys';
import { SelectOption } from '@/types/select-option';
import { TShareCatalog } from '@/domain/entities/catalog.entity';

export const useShareCatalog = <TData>(options?: SelectOption<TShareCatalog, TData>) => {
  const projectId = useProjectId();

  return useQuery<TShareCatalog, Error, TData>({
    queryKey: shareCatalogQueryKey(projectId),
    queryFn: () => getShareCatalog(projectId),
    select: options?.select,
  });
};
