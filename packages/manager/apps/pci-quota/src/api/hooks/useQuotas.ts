import { useQuery } from '@tanstack/react-query';
import { ColumnSort } from '@tanstack/react-table';
import { PaginationState } from '@ovh-ux/manager-react-components';
import { getQuotas, IQuota } from '@/api/data/quota';

const paginateResults = <T>(items: T[], pagination: PaginationState) => ({
  rows: items.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize,
  ),
  pageCount: Math.ceil(items.length / pagination.pageSize),
  totalRows: items.length,
});

export const sortQuotas = (sorting: ColumnSort, storages: IQuota[]) => {
  return storages;
};

export const useQuotas = (
  projectId: string,
  pagination: PaginationState,
  sorting: ColumnSort,
) => {
  const query = useQuery({
    queryKey: ['project', projectId, 'quotas'],
    queryFn: () => getQuotas(projectId),
  });
  return {
    ...query,
    paginatedData: paginateResults<IQuota>(
      sortQuotas(sorting, query.data || []),
      pagination,
    ),
  };
};
