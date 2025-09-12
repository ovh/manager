import { TRefetchInterval } from '../../infra/tanstack/common.types';
import { DatagridColumn, ColumnSort } from '../../../../components';

export type FetchV6Result<TData> = {
  data: TData[];
};

export type ResourcesV6Params<TData = Record<string, unknown>> = {
  cacheKey: string | string[];
  fetchDataFn?: (route: string) => Promise<FetchV6Result<TData>>;
  refetchInterval?: TRefetchInterval;
  enabled?: boolean;
  columns: DatagridColumn<TData>[];
  defaultSorting?: ColumnSort;
  route: string;
  pageSize?: number;
};
