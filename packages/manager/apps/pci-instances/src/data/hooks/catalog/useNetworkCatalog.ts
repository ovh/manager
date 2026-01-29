import { useQuery } from '@tanstack/react-query';
import { getNetworkCatalog } from '@/data/api/networkCatalog';
import { useProjectId } from '@/hooks/project/useProjectId';
import { networkCatalogQueryKey } from '@/adapters/tanstack/networkCatalog/queryKeys';
import { TNetworkCatalog } from '@/domain/entities/networkCatalog';
import { TSelectOptions } from '@/types/querySelectOptions.type';

export const useNetworkCatalog = <TData>(
  options: TSelectOptions<TNetworkCatalog, TData>,
) => {
  const { select } = options;
  const projectId = useProjectId();

  return useQuery({
    queryKey: networkCatalogQueryKey(projectId),
    queryFn: () => getNetworkCatalog({ projectId }),
    select,
  });
};
