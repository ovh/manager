import { v6 } from '@ovh-ux/manager-core-api';
import { ColumnSort, PaginationState } from '@tanstack/react-table';
import { TFlavor, TInstance } from '@/type';

export type TInstanceOptions = {
  pagination: PaginationState;
  sorting: ColumnSort;
};

export const getInstance = async (projectId: string, instanceId: string) => {
  const { data } = await v6.get<TInstance>(
    `/cloud/project/${projectId}/instance/${instanceId}`,
  );
  return data;
};

export const getFlavor = async (
  projectId: string,
  flavoid: string,
): Promise<TFlavor> => {
  const { data } = await v6.get<TFlavor>(
    `/cloud/project/${projectId}/flavor/${flavoid}`,
  );
  return data;
};

export const getAllInstance = async (
  projectId: string,
): Promise<TInstance[]> => {
  const { data } = await v6.get<TInstance[]>(
    `/cloud/project/${projectId}/instance`,
  );
  return data;
};

export const paginateResults = <T>(
  items: T[],
  pagination: PaginationState,
) => ({
  rows: items.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize,
  ),
  pageCount: Math.ceil(items.length / pagination.pageSize),
  totalRows: items.length,
});

export const sortResults = (items: TInstance[], sorting: ColumnSort) => {
  let data: TInstance[];
  if (sorting?.id === 'status') {
    data = [...items].sort((a, b) => (a.statusGroup > b.statusGroup ? 1 : 0));
  } else {
    data = [...items].sort((a, b) => (a[sorting?.id] > b[sorting?.id] ? 1 : 0));
  }

  if (sorting) {
    const { desc } = sorting;

    if (desc) {
      data.reverse();
    }
  }
  return data;
};
