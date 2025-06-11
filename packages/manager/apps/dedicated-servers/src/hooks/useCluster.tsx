import { useQuery } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { getClusters, getClusterQueryKey } from '@/data/api/cluster';

export const useCluster = () => {
  const { data: features, isSuccess } = useFeatureAvailability([
    'dedicated-server:cluster',
  ]);

  return useQuery<string[], ApiError>({
    queryKey: getClusterQueryKey,
    enabled: isSuccess && features?.['dedicated-server:cluster'],
    queryFn: async () => {
      const { data } = await getClusters();
      return data;
    },
  });
};
