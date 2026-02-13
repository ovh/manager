import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { cloud } from '@datatr-ux/ovhcloud-types';
import { apiClient } from '@/data/api/api.client';
import { OBJECTS_PAGE } from '@/pages/object-storage/s3/[region]/[s3Name]/objects/objects.constants';

type StorageObject = cloud.StorageObject & { isCommonPrefix: boolean };

export type S3BrowserItem =
  | { type: 'parent' }
  | {
      type: 'folder';
      key: string; // ex: "new_object/"
      name: string; // ex: "new_object"
    }
  | ({
      type: 'file';
      name: string;
    } & cloud.StorageObject);

/**
 * Extracts the display name from a folder key.
 *
 * S3 folder keys end with "/" (e.g., "photos/2024/"). This function extracts
 * the folder name to display in the UI.
 *
 * @param key - The S3 object key (e.g., "photos/2024/")
 * @returns The folder name (e.g., "2024")
 *
 * @example
 * getFolderName("photos/") // returns "photos"
 * getFolderName("photos/2024/") // returns "2024"
 * getFolderName("my folder/") // returns "my folder"
 */
export function getFolderName(key: string): string {
  // Remove trailing slash and split into path segments
  const keyWithoutSlash = key.replace(/\/$/, '');
  const segments = keyWithoutSlash.split('/');

  // Return the last segment (folder name)
  return segments[segments.length - 1] || keyWithoutSlash;
}

/**
 * Extracts the display name from a key for files
 * For files, always return the filename (last segment), regardless of prefix
 */
function getFileName(key: string): string {
  const segments = key.split('/');
  return segments[segments.length - 1] || key;
}

export function mapToBrowserItem(o: StorageObject): S3BrowserItem {
  if (o.isCommonPrefix) {
    return {
      type: 'folder',
      key: o.key,
      name: getFolderName(o.key),
    };
  }

  return {
    type: 'file',
    ...o,
    name: getFileName(o.key),
  };
}

export interface UseS3ObjectsBrowserParams {
  projectId: string;
  region: string;
  storageName: string;
  prefix: string;
  withVersions: boolean;
  limit?: number;
  showParent?: boolean;
}

export function useS3ObjectsBrowser({
  projectId,
  region,
  storageName,
  prefix,
  withVersions,
  limit = OBJECTS_PAGE.DEFAULT_LIMIT,
  showParent = true,
}: UseS3ObjectsBrowserParams) {
  const query = useInfiniteQuery({
    queryKey: [
      's3-browser',
      projectId,
      region,
      storageName,
      prefix,
      withVersions,
      limit,
    ],

    initialPageParam: undefined,

    queryFn: async ({ pageParam }) =>
      apiClient.v6.get<StorageObject[]>(
        `/cloud/project/${projectId}/region/${region}/storage/${storageName}/object`,
        {
          params: {
            limit,
            prefix,
            delimiter: '/',
            keyMarker: pageParam,
            withVersions,
          },
        },
      ),

    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length < limit) {
        return undefined; // End of data reached
      }
      return lastPage[lastPage.length - 1]?.key;
    },

    // Disable automatic refetching to prevent unwanted data reloads
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  /* ---------- DATA FLATTEN ---------- */

  const rawItems = useMemo(() => query.data?.pages.flat() ?? [], [query.data]);

  const items: S3BrowserItem[] = useMemo(() => {
    const mapped = rawItems.map((o) => mapToBrowserItem(o));

    return prefix && showParent
      ? [{ type: 'parent' as const }, ...mapped]
      : mapped;
  }, [rawItems, prefix, showParent]);

  return {
    /* react-query */
    ...query,

    /* UI-ready data */
    items,
  };
}
