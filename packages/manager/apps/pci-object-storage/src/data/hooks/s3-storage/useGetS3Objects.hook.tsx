import { getS3Objects } from '@/data/api/storage/s3Storage.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/useImmediateRefetch';

export type UseGetS3ObjectProps = {
  projectId: string;
  region: string;
  name: string;
  limit?: number;
  keyMarker?: string;
  prefix?: string;
  versionIdMarker?: string;
  withVersions?: boolean;
  options?: OptionsFor<typeof getS3Objects>;
};

export function useGetS3Objects({
  projectId,
  region,
  name,
  limit,
  keyMarker,
  prefix,
  versionIdMarker,
  withVersions,
  options,
}: UseGetS3ObjectProps) {
  const queryKey = [
    projectId,
    'region',
    region,
    'storage',
    name,
    'object',
    { withVersions },
  ];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () =>
      getS3Objects({
        projectId,
        region,
        name,
        limit,
        prefix,
        keyMarker,
        versionIdMarker,
        withVersions,
      }),
    ...options,
  });
}
