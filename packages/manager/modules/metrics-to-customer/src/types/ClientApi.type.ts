import React from 'react';

import type { Filter } from '@ovh-ux/manager-core-api';
import type { ColumnSort, DatagridColumn } from '@ovh-ux/manager-react-components';

export type ApiVersion = 'v2' | 'v6';

export type TAbortSignal = {
  signal?: AbortSignal;
};

export type JsonRequestOptions = {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  disableCache?: boolean;
};

export type ObservabilityServiceParams = {
  resourceName: string;
} & TAbortSignal;

export type ObservabilityMetricParams = {
  resourceName: string;
} & TAbortSignal;

export type ObservabilityMetricKindsParams = {
  productType: string;
} & ObservabilityMetricParams;

export type ObservabilityMetricKindParams = {
  kindName: string;
} & ObservabilityMetricParams;

export type ObservabilityDashboardParams = {
  resourceName: string;
  productType: string;
} & TAbortSignal;

export type ObservabilityMetricDataParams = {
  type: 'query' | 'query_range';
  query: string;
  start: number;
  end: number;
  step: number;
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
