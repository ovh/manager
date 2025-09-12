import { Dispatch, SetStateAction } from 'react';
import {
  IcebergFetchResult,
  IcebergFetchParams,
} from '@ovh-ux/manager-core-api';
import { DatagridColumn, ColumnSort } from '../../../../components';
import { InfiniteData } from '../../adapters/use-infinite-query';

export type UseIcebergParams<TColumn = unknown> = IcebergFetchParams & {
  queryKey: string | string[];
  defaultSorting?: ColumnSort;
  fetchAll?: boolean;
  columns?: DatagridColumn<TColumn>[];
  enabled?: boolean;
};

export type SelectData<TData> = {
  data: InfiniteData<IcebergFetchResult<TData>>;
  pageIndex: number;
  totalCount?: number;
  flattenData: TData[];
};
