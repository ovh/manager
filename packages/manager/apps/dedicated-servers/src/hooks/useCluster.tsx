import { useQuery } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { getClusters, getClusterQueryKey } from '@/data/api/cluster';

export const useCluster = () => {
  return useQuery<string[], ApiError>({
    queryKey: getClusterQueryKey,
    queryFn: async () => {
      const { data } = await getClusters();
      return data;
    },
  });
};
