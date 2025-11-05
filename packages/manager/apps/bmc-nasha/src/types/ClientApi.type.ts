import React from 'react';

import type { SortingState } from '@tanstack/react-table';

import type { Filter } from '@ovh-ux/manager-core-api';
import type { ColumnSort, DatagridColumn } from '@ovh-ux/muk';

export type ApiVersion = 'v2' | 'v6';

export type JsonRequestOptions = {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  disableCache?: boolean;
};

export type GetListingParams = {
  route?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDesc?: boolean;
  filters?: Filter[];
  cursor?: string;
};

export type UseResourcesParams<T extends Record<string, unknown>> = {
  route: string;
  queryKey?: string[];
  columns?: DatagridColumn<T>[];
  pageSize?: number;
  defaultSorting?: SortingState;
  shouldFetchAll?: boolean;
  fetchAll?: boolean;
  disableCache?: boolean;
  enabled?: boolean;
  refetchInterval?: number | false;
  fetchDataFn?: (route: string) => Promise<{ data: T[] }>;
};

export type ResourcesFacadeResult<T> = {
  flattenData?: T[];
  totalCount?: number;
  hasNextPage?: boolean;
  fetchNextPage?: () => Promise<unknown> | void;
  isLoading?: boolean;
  status?: 'pending' | 'success' | 'error';
  sorting?: SortingState[0];
  setSorting?: React.Dispatch<React.SetStateAction<SortingState>>;
  filters?: unknown;
  search?: unknown;
};
