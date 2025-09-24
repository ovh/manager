import { useMemo } from 'react';
import { ColumnSort } from '@tanstack/react-table';
import { TObject } from '@/api/data/container';

export function useSortedObjects(
  objects: TObject[] | undefined,
  sorting: ColumnSort | undefined,
  containerS3Type: string | undefined,
) {
  return useMemo(() => {
    if (!objects || !containerS3Type) return [];

    const sortedObjects = [...objects];

    if (sorting) {
      const { id, desc } = sorting;
      sortedObjects.sort((a, b) => {
        if (a[id] === null || a[id] === undefined) return desc ? -1 : 1;
        if (b[id] === null || b[id] === undefined) return desc ? -1 : 1;

        if (id === 'lastModified') {
          const dateA = new Date(a[id]).getTime();
          const dateB = new Date(b[id]).getTime();
          return desc ? dateB - dateA : dateA - dateB;
        }

        if (typeof a[id] === 'string' && typeof b[id] === 'string') {
          return desc ? b[id].localeCompare(a[id]) : a[id].localeCompare(b[id]);
        }

        return desc ? b[id] - a[id] : a[id] - b[id];
      });
    }

    return sortedObjects.map((object, index) => ({
      ...object,
      index: `${index}`,
    }));
  }, [objects, sorting, containerS3Type]);
}
