import { getS3Lifecycle } from '@/data/api/storage/s3Storage.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/useImmediateRefetch';
import { getLifecycleQueryKey } from '@/data/hooks/lifecycle/lifecycleQueryKey';

export type UseGetS3LifecycleProps = {
  projectId: string;
  region: string;
  name: string;
  options?: OptionsFor<typeof getS3Lifecycle>;
};

export function useGetS3Lifecycle({
  projectId,
  region,
  name,
  options,
}: UseGetS3LifecycleProps) {
  return useQueryImmediateRefetch({
    queryKey: getLifecycleQueryKey({ projectId, region, name }),
    queryFn: () => getS3Lifecycle({ projectId, region, name }),
    ...options,
  });
}
