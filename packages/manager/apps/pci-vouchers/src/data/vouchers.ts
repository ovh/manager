import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import { ColumnSort, PaginationState } from '@ovhcloud/manager-components';
import { Voucher } from '@/interface';
import {
  creditComparator,
  defaultCompareFunction,
  validityComparator,
} from './utils';

export type VouchersOptions = {
  pagination: PaginationState;
  sorting: ColumnSort;
};

export const getAllVouchers = async (projectId: string): Promise<Voucher[]> => {
  const { data } = await fetchIcebergV6<Voucher>({
    route: `/cloud/project/${projectId}/credit`,
  });

  return data;
};

export const paginateResults = (
  items: Voucher[],
  pagination: PaginationState,
) => {
  return {
    rows: items.slice(
      pagination.pageIndex * pagination.pageSize,
      (pagination.pageIndex + 1) * pagination.pageSize,
    ),
    pageCount: Math.ceil(items.length / pagination.pageSize),
    totalRows: items.length,
  };
};

export const filterVouchers = (
  vouchers: Voucher[],
  sorting: ColumnSort,
): Voucher[] => {
  const data = [...vouchers];

  if (sorting) {
    const { id: sortKey, desc } = sorting;

    if (['available_credit', 'total_credit'].includes(sortKey)) {
      data.sort(
        creditComparator(sortKey as 'available_credit' | 'total_credit'),
      );
    } else if (sortKey === 'validityFrom') {
      data.sort(validityComparator('from'));
    } else if (sortKey === 'validityTo') {
      data.sort(validityComparator('to'));
    } else {
      data.sort(defaultCompareFunction(sortKey as keyof Voucher));
    }
    if (desc) {
      data.reverse();
    }
  }

  return data;
};

export default getAllVouchers;
