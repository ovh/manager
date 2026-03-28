import type { Dispatch, SetStateAction } from 'react';

import type { SortingState } from '@tanstack/react-table';

import type { Filter } from '@ovh-ux/manager-core-api';

import { DatagridColumn } from '@/components/datagrid/Datagrid.props';
import { FilterWithLabel } from '@/components/filters/Filter.props';
import { TRefetchInterval } from '@/hooks/data-api/infra/tanstack/common.types';

import { UseInifiniteQueryResult, UseQueryResult } from '../infra/tanstack';

export type UrlParamValue = string | string[];

export type UseDataApiOptions<TData = Record<string, unknown>> = {
  route?: string;
  version: 'v2' | 'v6';
  iceberg?: boolean;
  cacheKey: string | string[];
  enabled?: boolean;
  refetchInterval?: TRefetchInterval;
  pageSize?: number;
  defaultSorting?: SortingState;
  fetchAll?: boolean;
  disableCache?: boolean;
  columns?: DatagridColumn<TData>[];
  urlParams?: {
    params: Record<string, UrlParamValue | undefined>;
    setParams: (params: Record<string, UrlParamValue | null | undefined>) => void;
    deleteParams: (key: string) => void;
    paramsToString?: () => string;
    searchParams?: string;
  };
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
  sorting?: {
    sorting: SortingState;
    setSorting: Dispatch<SetStateAction<SortingState>>;
    manualSorting: boolean;
  };
  filters?: {
    filters: FilterWithLabel[];
    add: (filter: FilterWithLabel) => void;
    remove: (filter: Filter) => void;
  };
  search?: {
    onSearch: (search: string | undefined) => void;
    searchInput: string;
    setSearchInput: Dispatch<SetStateAction<string>>;
    searchParams?: string;
  };
};
