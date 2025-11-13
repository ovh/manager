import { getS3ObjectVersions } from '@/data/api/storage/s3Storage.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/useImmediateRefetch';

export type UseGetS3ObjectVersionsProps = {
  projectId: string;
  region: string;
  name: string;
  key: string;
  limit?: number;
  versionIdMarker?: string;
  options?: OptionsFor<typeof getS3ObjectVersions>;
};

export function useGetS3ObjectVersions({
  projectId,
  region,
  name,
  key,
  limit,
  versionIdMarker,
  options,
}: UseGetS3ObjectVersionsProps) {
  const queryKey = [
    projectId,
    'region',
    region,
    'storage',
    name,
    'object',
    key,
    'version',
  ];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () =>
      getS3ObjectVersions({
        projectId,
        region,
        name,
        key,
        limit,
        versionIdMarker,
      }),
    ...options,
  });
}
