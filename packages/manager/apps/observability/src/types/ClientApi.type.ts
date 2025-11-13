import React from 'react';

import type { ColumnSort } from '@tanstack/react-table';

import type { Filter } from '@ovh-ux/manager-core-api';
import type { DatagridColumn } from '@ovh-ux/muk';

export type ApiVersion = 'v2' | 'v6';

export type JsonRequestOptions = {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  disableCache?: boolean;
};

export type ObservabilityServiceParams = {
  serviceName: string;
  signal?: AbortSignal;
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
  queryKey: string[];
  columns?: DatagridColumn<T>[];
  pageSize?: number;
  defaultSorting?: ColumnSort;
  shouldFetchAll?: boolean;
  disableCache?: boolean;
};

export type ResourcesFacadeResult<T> = {
  flattenData?: T[];
  totalCount?: number;
  hasNextPage?: boolean;
  fetchNextPage?: () => Promise<unknown> | void;
  isLoading?: boolean;
  status?: 'pending' | 'success' | 'error';
  sorting?: ColumnSort;
  setSorting?: React.Dispatch<React.SetStateAction<ColumnSort>>;
  filters?: unknown;
  search?: unknown;
};
