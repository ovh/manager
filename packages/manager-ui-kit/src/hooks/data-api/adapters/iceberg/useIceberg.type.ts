import type { SortingState } from '@tanstack/react-table';

import type { IcebergFetchParams } from '@ovh-ux/manager-core-api';

import { DatagridColumn } from '@/components/datagrid/Datagrid.props';

export type UseIcebergParams<TData = Record<string, unknown>> = IcebergFetchParams & {
  cacheKey: string | string[];
  defaultSorting?: SortingState;
  fetchAll?: boolean;
  columns?: DatagridColumn<TData>[];
  enabled?: boolean;
};

export type UseIcebergData<TData = Record<string, unknown>> = {
  pageIndex: number;
  totalCount?: number;
  flattenData: TData[];
};
