import { getS3ObjectVersion } from '@/data/api/storage/s3Storage.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/useImmediateRefetch';

export type UseGetS3ObjectVersionProps = {
  projectId: string;
  region: string;
  name: string;
  key: string;
  versionId: string;
  options?: OptionsFor<typeof getS3ObjectVersion>;
};

export function useGetS3ObjectVersion({
  projectId,
  region,
  name,
  key,
  versionId,
  options,
}: UseGetS3ObjectVersionProps) {
  const queryKey = [
    projectId,
    'region',
    region,
    'storage',
    name,
    'object',
    key,
    'version',
    versionId,
  ];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () =>
      getS3ObjectVersion({
        projectId,
        region,
        name,
        key,
        versionId,
      }),
    ...options,
  });
}
