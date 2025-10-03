import type { Dispatch, SetStateAction } from 'react';
import { Filter } from '@ovh-ux/manager-core-api';
import { TRefetchInterval } from '../../infra/tanstack/common.types';
import { UseQueryResult } from '../../infra/tanstack/use-query';
import { UseInifiniteQueryResult } from '../../infra/tanstack/use-infinite-query';
import {
  ColumnSort,
  FilterWithLabel,
  DatagridColumn,
} from '../../../../components';

export type UseDataApiOptions<TData = Record<string, unknown>> = {
  route?: string;
  version: 'v2' | 'v6';
  iceberg?: boolean;
  cacheKey: string | string[];
  enabled?: boolean;
  refetchInterval?: TRefetchInterval;
  pageSize?: number;
  defaultSorting?: ColumnSort;
  fetchAll?: boolean;
  disableCache?: boolean;
  columns?: DatagridColumn<TData>[];
  fetchDataFn?: (route: string) => Promise<{ data: TData[] }>;
};

export type UseDataApiResult<TData = Record<string, unknown>> = (
  | Omit<UseQueryResult, 'data'>
  | Omit<UseInifiniteQueryResult, 'data'>
) & {
  hasNextPage: boolean;
  fetchNextPage: UseInifiniteQueryResult['fetchNextPage'] | (() => void);
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
