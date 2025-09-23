import { useQuery } from '@tanstack/react-query';
import { instancesCatalogQueryKey } from '@/adapters/tanstack/instancesCatalog/queryKeys';
import { getInstancesCatalog } from '@/data/api/instancesCatalog';
import { useProjectId } from '@/hooks/project/useProjectId';

export const useInstancesCatalog = () => {
  const projectId = useProjectId();

  const { data, ...query } = useQuery({
    queryKey: instancesCatalogQueryKey(projectId),
    queryFn: () => getInstancesCatalog({ projectId }),
  });

  return {
    data,
    ...query,
  };
};
