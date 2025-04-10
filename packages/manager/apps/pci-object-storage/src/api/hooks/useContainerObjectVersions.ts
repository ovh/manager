import { useInfiniteQuery } from '@tanstack/react-query';

import { getObjectVersions } from '../data/objects';
import { ITEMS_PER_PAGE } from '@/constants';

export const getObjectVersionsQueryKey = ({
  projectId,
  region,
  containerName,
  key,
}: {
  projectId: string;
  region: string;
  containerName: string;
  key: string;
}) => [
  'project',
  projectId,
  'region',
  region,
  'server-container-objects',
  containerName,
  key,
];

interface UseObjectVersionsParams {
  projectId: string;
  region: string;
  name: string;
  key: string;
  isS3StorageType: string;
}

export const useServerContainerObjectVersions = ({
  projectId,
  region,
  name,
  key,
  isS3StorageType,
}: UseObjectVersionsParams) => {
  return useInfiniteQuery({
    queryKey: getObjectVersionsQueryKey({
      projectId,
      region,
      containerName: name,
      key,
    }),
    queryFn: ({ pageParam }) =>
      getObjectVersions({
        projectId,
        region,
        name,
        key,
        versionIdMarker: pageParam?.versionIdMarker,
      }),
    initialPageParam: { versionIdMarker: null },
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
