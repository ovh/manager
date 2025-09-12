import { TRefetchInterval } from '../../adapters/use-query';
import { DatagridColumn, ColumnSort } from '../../../../components';

export type FetchV6Result<TData> = {
  data: TData[];
};

export type ResourcesV6Params<TData = unknown, TColumn = unknown> = {
  queryKey: string | string[];
  queryFn?: (route: string) => Promise<FetchV6Result<TData>>;
  refetchInterval?: TRefetchInterval;
  enabled?: boolean;
  columns: DatagridColumn<TColumn>[];
  defaultSorting?: ColumnSort;
  route: string;
  pageSize?: number;
};
