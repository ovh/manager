import { useQueryClient } from '@tanstack/react-query';
import { getS3Lifecycle } from '@/data/api/storage/s3Storage.api';
import storages from '@/types/Storages';
import {
  getLifecycleQueryKey,
  LifecycleStorageParams,
} from './lifecycleQueryKey';

export function useFetchLifecycleRules() {
  const queryClient = useQueryClient();

  const fetchLifecycleRules = async (
    params: LifecycleStorageParams,
  ): Promise<storages.LifecycleRule[]> => {
    const queryKey = getLifecycleQueryKey(params);
    const existing = await queryClient.fetchQuery({
      queryKey,
      queryFn: () => getS3Lifecycle(params),
    });
    return existing?.rules || [];
  };

  return { fetchLifecycleRules };
}
