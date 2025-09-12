import { IcebergFetchParams } from '@ovh-ux/manager-core-api';
import { DatagridColumn, ColumnSort } from '../../../../components';

export type UseIcebergParams<TData = Record<string, unknown>> =
  IcebergFetchParams & {
    cacheKey: string | string[];
    defaultSorting?: ColumnSort;
    fetchAll?: boolean;
    columns?: DatagridColumn<TData>[];
    enabled?: boolean;
  };

export type UseIcebergData<TData = Record<string, unknown>> = {
  pageIndex: number;
  totalCount?: number;
  flattenData: TData[];
};
