import { useQuery } from '@tanstack/react-query';
import { instancesCatalogQueryKey } from '@/adapters/tanstack/instancesCatalog/queryKeys';
import { getInstancesCatalog } from '@/data/api/instancesCatalog';
import { useProjectId } from '@/hooks/project/useProjectId';
import { TInstancesCatalog } from '@/domain/entities/instancesCatalog';
import { TSelectOptions } from '@/types/querySelectOptions.type';

export const useInstancesCatalogWithSelect = <TData>(
  options: TSelectOptions<TInstancesCatalog, TData>,
) => {
  const projectId = useProjectId();

  const { data, ...query } = useQuery({
    queryKey: instancesCatalogQueryKey(projectId),
    queryFn: () => getInstancesCatalog({ projectId }),
    select: options.select,
  });

  return {
    data,
    ...query,
  };
};
