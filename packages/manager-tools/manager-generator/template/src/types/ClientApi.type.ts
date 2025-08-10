import React from 'react';

import type { Filter } from '@ovh-ux/manager-core-api';
import type { ColumnSort, DatagridColumn } from '@ovh-ux/manager-react-components';

/**
 * Supported API versions.
 *
 * @remarks
 * Determines whether to use legacy v2 (cursor-based) or modern v6 (Iceberg/paginated).
 */
export type ApiVersion = 'v2' | 'v6';

/**
 * Options for generic JSON HTTP helpers.
 *
 * @remarks
 * These options are passed to `getJSON`, `postJSON`, `putJSON`, and `deleteJSON`
 * to configure query params, headers, and caching behavior.
 */
export type JsonRequestOptions = {
  /** Query string parameters to append to the request. */
  params?: Record<string, unknown>;
  /** Header overrides for the request. */
  headers?: Record<string, string>;
  /** When true, adds `Pragma: no-cache` to disable browser/proxy caching. */
  disableCache?: boolean;
};

/**
 * Parameters for fetching listing data.
 *
 * @remarks
 * Normalizes options across Iceberg v2, Iceberg v6, and plain v6 APIs.
 */
export type GetListingParams = {
  /** Explicit route override (otherwise taken from app constants). */
  route?: string;
  /** Iceberg v6: page number (1-based). Ignored by v2. */
  page?: number;
  /** Maximum rows per page. */
  pageSize?: number;
  /** Sort field name (column key). */
  sortBy?: string;
  /** Descending sort flag. */
  sortDesc?: boolean;
  /** Iceberg filter descriptors. */
  filters?: Filter[];
  /** Iceberg v2: cursor token for fetching the next page. */
  cursor?: string;
};

/**
 * Parameters for the `useResources` hook.
 *
 * @typeParam T - Resource item type (row shape).
 *
 * @remarks
 * This configures the facade hook that abstracts over Iceberg v2/v6 and plain v6.
 */
export type UseResourcesParams<T extends Record<string, unknown>> = {
  /** Backend API route (e.g., `'/publicCloud/project'`). */
  route: string;
  /** React Query cache key (used for deduplication/invalidation). */
  queryKey: string[];
  /**
   * Datagrid columns (required by Iceberg wrappers
   * to infer filters and search fields).
   */
  columns?: DatagridColumn<T>[];
  /** Page size (default depends on the underlying strategy). */
  pageSize?: number;
  /** Initial sorting preference (column + direction). */
  defaultSorting?: ColumnSort;
  /** When true, hooks attempt to fetch all rows (capped by library max). */
  shouldFetchAll?: boolean;
  /** Disable cache headers for the request (`Pragma: no-cache`). */
  disableCache?: boolean;
};

/**
 * Minimal, opaque return type for resource-fetching hooks.
 *
 * @typeParam T - Resource item type (row shape).
 *
 * @remarks
 * Provides only the fields that most UIs need.
 * Deliberately avoids leaking internal Iceberg types (`Filters`, `Search`)
 * to prevent TS4058 “name cannot be named” issues.
 */
export type ResourcesFacadeResult<T> = {
  /** Flattened list of items across fetched pages. */
  flattenData?: T[];
  /** Total number of items (when available). */
  totalCount?: number;
  /** Whether more pages are available. */
  hasNextPage?: boolean;
  /** Function to fetch the next page of results. */
  fetchNextPage?: () => Promise<unknown> | void;
  /** Whether data is currently loading. */
  isLoading?: boolean;
  /** Status of the fetch request. */
  status?: 'pending' | 'success' | 'error';
  /** Current sorting configuration. */
  sorting?: ColumnSort;
  /** Setter for sorting configuration. */
  setSorting?: React.Dispatch<React.SetStateAction<ColumnSort>>;
  /** Iceberg-specific filters (intentionally opaque). */
  filters?: unknown;
  /** Iceberg-specific search state (intentionally opaque). */
  search?: unknown;
};
