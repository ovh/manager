import { getS3Lifecycle } from '@/data/api/storage/s3Storage.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/useImmediateRefetch';

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
  const queryKey = [projectId, 'region', region, 'storage', name, 'lifecycle'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getS3Lifecycle({ projectId, region, name }),
    ...options,
  });
}
