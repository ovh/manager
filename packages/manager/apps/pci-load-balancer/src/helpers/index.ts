import { PaginationState } from '@ovh-ux/manager-react-components';
import { ColumnSort } from '@tanstack/react-table';
import { TLoadBalancer } from '@/types';

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
export const sortResults = (items: TLoadBalancer[], sorting: ColumnSort) => {
  let data: TLoadBalancer[];
  switch (sorting?.id) {
    default:
      data = [...items].sort((a, b) =>
        a[sorting?.id] > b[sorting?.id] ? 1 : 0,
      );
      break;
  }
  if (sorting) {
    const { desc } = sorting;

    if (desc) {
      data.reverse();
    }
  }
  return data;
};
