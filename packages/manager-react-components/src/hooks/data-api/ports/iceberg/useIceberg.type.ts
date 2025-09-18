import {
  IcebergFetchResult,
  IcebergFetchParams,
} from '@ovh-ux/manager-core-api';
import { DatagridColumn, ColumnSort } from '../../../../components';
import { InfiniteData } from '../../adapters/use-infinite-query';

export type UseIcebergParams<TData = Record<string, unknown>> = IcebergFetchParams & {
  queryKey: string | string[];
  defaultSorting?: ColumnSort;
  fetchAll?: boolean;
  columns?: DatagridColumn<TData>[];
  enabled?: boolean;
};

export type SelectData<TData = Record<string, unknown>> = {
  data: InfiniteData<IcebergFetchResult<TData>>;
  pageIndex: number;
  totalCount?: number;
  flattenData: TData[];
};
