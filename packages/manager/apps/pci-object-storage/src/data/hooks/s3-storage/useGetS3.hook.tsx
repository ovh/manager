import { getS3Storage } from '@/data/api/storage/s3Storage.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/useImmediateRefetch';

export function useGetS3(
  projectId: string,
  region: string,
  name: string,
  limit?: number,
  marker?: string,
  prefix?: string,
  options?: OptionsFor<typeof getS3Storage>,
) {
  const queryKey = [projectId, 'region', region, 'storage', name];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () =>
      getS3Storage({ projectId, region, name, limit, marker, prefix }),
    ...options,
  });
}
