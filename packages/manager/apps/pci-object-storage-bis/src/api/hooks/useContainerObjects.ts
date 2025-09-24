import { useInfiniteQuery } from '@tanstack/react-query';

import { getContainerObjects } from '@/api/data/container';
import { ITEMS_PER_PAGE } from '@/constants';

const getContainerObjectsQueryKey = ({
  projectId,
  region,
  containerName,
  prefix,
}: {
  projectId: string;
  region: string;
  containerName: string;
  prefix: string | null;
}) => {
  const baseKey = [
    'project',
    projectId,
    'region',
    region,
    'server-container-objects',
    containerName,
  ];

  const prefixKey = !prefix ? [] : ['prefix', prefix];

  return [...baseKey, ...prefixKey];
};

interface UseServerContainerObjectsParams {
  projectId: string;
  region: string;
  name: string;
  withVersions: boolean;
  prefix: string;
  isS3StorageType: string;
}

export const useServerContainerObjects = ({
  projectId,
  region,
  name,
  withVersions,
  isS3StorageType,
  prefix,
}: UseServerContainerObjectsParams) => {
  return useInfiniteQuery({
    queryKey: getContainerObjectsQueryKey({
      projectId,
      region,
      containerName: name,
      prefix,
    }),
    queryFn: ({ pageParam }) =>
      getContainerObjects({
        projectId,
        region,
        name,
        withVersions,
        keyMarker: pageParam?.keyMarker,
        versionIdMarker: pageParam?.versionIdMarker,
        prefix,
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
};
