import { getS3Object } from '@/data/api/storage/s3Storage.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/useImmediateRefetch';

export type UseGetS3ObjectProps = {
  projectId: string;
  region: string;
  name: string;
  key: string;
  options?: OptionsFor<typeof getS3Object>;
};

export function useGetS3Object({
  projectId,
  region,
  name,
  key,
  options,
}: UseGetS3ObjectProps) {
  const queryKey = [
    projectId,
    'region',
    region,
    'storage',
    name,
    'object',
    key,
  ];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () =>
      getS3Object({
        projectId,
        region,
        name,
        key,
      }),
    ...options,
  });
}
