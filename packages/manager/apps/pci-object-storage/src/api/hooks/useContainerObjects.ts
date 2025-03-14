import { useInfiniteQuery } from '@tanstack/react-query';

import { getContainerObjects } from '@/api/data/container';

export const getContainerObjectsQueryKey = ({
  projectId,
  region,
  containerName,
}: {
  projectId: string;
  region: string;
  containerName: string;
}) => [
  'project',
  projectId,
  'region',
  region,
  'server-container-objects',
  containerName,
];

interface UseServerContainerObjectsParams {
  projectId: string;
  region: string;
  name: string;
  withVersions: boolean;
  isS3StorageType: string;
}

export const useServerContainerObjects = ({
  projectId,
  region,
  name,
  withVersions,
  isS3StorageType,
}: UseServerContainerObjectsParams) => {
  const query = useInfiniteQuery({
    queryKey: getContainerObjectsQueryKey({
      projectId,
      region,
      containerName: name,
    }),
    queryFn: ({ pageParam }) =>
      getContainerObjects({
        projectId,
        region,
        name,
        withVersions,
        keyMarker: pageParam?.keyMarker,
        versionIdMarker: pageParam?.versionIdMarker,
      }),
    initialPageParam: { keyMarker: null, versionIdMarker: null },
    enabled: !!projectId && !!name && !!region && !!isS3StorageType,
    staleTime: 0,

    getNextPageParam: (lastPage) => {
      const lastObject = lastPage.objects[lastPage.objects.length - 1];
      if (!lastObject?.key && !lastObject?.versionId) {
        return undefined;
      }
      return {
        keyMarker: lastObject.key,
        versionIdMarker: lastObject.versionId,
      };
    },
    select: (data) => {
      return data?.pages.flatMap((page) => page.objects);
    },
  });

  return query;
};
