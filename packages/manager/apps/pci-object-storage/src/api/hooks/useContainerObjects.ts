import { useInfiniteQuery } from '@tanstack/react-query';

import { getContainerObjects } from '@/api/data/container';
import { ITEMS_PER_PAGE } from '@/constants';

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
      if (lastPage.objects.length === ITEMS_PER_PAGE + 1) {
        const markerObject = lastPage.objects[ITEMS_PER_PAGE - 1];
        return {
          keyMarker: markerObject.key,
          versionIdMarker: markerObject.versionId,
        };
      }

      return undefined;
    },
    select: (data) => {
      return data.pages.flatMap((page) =>
        page.objects.length > ITEMS_PER_PAGE
          ? page.objects.slice(0, ITEMS_PER_PAGE)
          : page.objects,
      );
    },
  });

  return query;
};
