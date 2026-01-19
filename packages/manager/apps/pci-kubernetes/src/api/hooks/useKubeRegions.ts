import { useQuery } from '@tanstack/react-query';

import { getKubeRegionsQueryKey } from '@/adapters/tanstack/kubeRegions/kubeRegions.queryKey';
import { getKubeRegions } from '@/api/data/regions';
import { useParam } from '@/hooks/useParam';

export const useKubeRegions = () => {
  const projectId = useParam('projectId');

  return useQuery({
    queryKey: getKubeRegionsQueryKey(projectId),
    queryFn: () => getKubeRegions(projectId),
    throwOnError: true,
  });
};
