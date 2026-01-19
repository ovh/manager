import { useQuery } from '@tanstack/react-query';

import { getKubeRegions } from '@/api/data/regions';

export const getKubeRegionsQueryKey = (projectId: string) => [
  'project',
  projectId,
  'kube',
  'regions',
];

export const useKubeRegions = (projectId: string) => {
  return useQuery({
    queryKey: getKubeRegionsQueryKey(projectId),
    queryFn: () => getKubeRegions(projectId),
    throwOnError: true,
  });
};
