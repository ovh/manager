import type { Dispatch, SetStateAction } from 'react';
import {
  Filter,
  FetchV2Result,
  IcebergFetchResult,
} from '@ovh-ux/manager-core-api';
import { UseQueryResult, TRefetchInterval } from './adapters/use-query';
import {
  InfiniteData,
  DefinedUseInfiniteQueryResult,
} from './adapters/use-infinite-query';
import { FetchV6Result } from './ports/v6/v6.type';
import { ColumnSort, FilterWithLabel, DatagridColumn } from '../../components';

export type UseDataApiOptions<TData = unknown, TColumn = unknown> = {
  route?: string;
  version: 'v2' | 'v6';
  iceberg?: boolean;
  queryKey: string | string[];
  enabled?: boolean;
  refetchInterval?: TRefetchInterval;
  pageSize?: number;
  defaultSorting?: ColumnSort;
  fetchAll?: boolean;
  disableCache?: boolean;
  columns?: DatagridColumn<TColumn>[];
  queryFn?: (route: string) => Promise<{ data: TData[] }>;
};

export type UseDataApiResult<TData = unknown> = (
  | Omit<UseQueryResult, 'data'>
  | Omit<DefinedUseInfiniteQueryResult, 'data'>
) & {
  data:
    | FetchV6Result<TData>
    | InfiniteData<IcebergFetchResult<TData>>
    | InfiniteData<FetchV2Result<TData>>;
  hasNextPage: boolean;
  fetchNextPage: DefinedUseInfiniteQueryResult['fetchNextPage'] | (() => void);
  totalCount?: number;
  flattenData: TData[];
  pageIndex?: number;
  sorting?: ColumnSort;
  setSorting?: Dispatch<SetStateAction<ColumnSort | undefined>>;
  filters?: {
    filters: FilterWithLabel[];
    add: (filter: FilterWithLabel) => void;
    remove: (filter: Filter) => void;
  };
  search?: {
    onSearch: (search: string | undefined) => void;
    searchInput: string;
    setSearchInput: Dispatch<SetStateAction<string>>;
  };
};
