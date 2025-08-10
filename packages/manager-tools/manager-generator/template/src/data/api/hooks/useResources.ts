/**
 * useResources.ts
 * -----------------------------------------------------------------------------
 * A **facade hook** that chooses the appropriate listing hook based on
 * the configured `APP_FEATURES.listingApi` strategy.
 *
 * - `'v6Iceberg'` → uses `useResourcesIcebergV6`
 * - `'v2'`        → uses `useResourcesIcebergV2`
 * - otherwise     → uses `useResourcesV6` (plain list, no Iceberg)
 *
 * This hook removes the need for page components to branch on v2/v6/Iceberg.
 *
 * BUILD/LINT NOTES:
 * - The choice is driven by a build-time feature flag, ensuring stable order
 *   of hook calls in a given build → safe to disable the hooks rule locally.
 * - Return type is an intentionally **opaque** facade to avoid `TS4058` errors
 *   caused by internal types (Filters/Search) from `@ovh-ux/manager-react-components`.
 */
import {
  useResourcesIcebergV2,
  useResourcesIcebergV6,
  useResourcesV6,
} from '@ovh-ux/manager-react-components';

import { APP_FEATURES } from '@/App.constants';
import { ResourcesFacadeResult, UseResourcesParams } from '@/types/ClientApi.type';

/* eslint-disable react-hooks/rules-of-hooks */

/**
 * Unified facade hook for fetching resources.
 *
 * Chooses the right underlying listing hook (`v6Iceberg`, `v2`, or plain `v6`)
 * based on `APP_FEATURES.listingApi`. Normalizes the return shape so consumers
 * can interact with a stable interface.
 *
 * @typeParam T - Resource item type (defaults to generic object).
 * @param params - Hook parameters:
 *   - `route`: API route to fetch from.
 *   - `queryKey`: React Query cache key.
 *   - `pageSize`: Number of items per page.
 *   - `defaultSorting`: Default sort config.
 *   - `shouldFetchAll`: Whether to recursively fetch all pages (Iceberg only).
 *   - `columns`: Column definitions (used for Iceberg filtering/search).
 *   - `disableCache`: Disables React Query cache layer.
 * @returns Opaque facade result with:
 *   - `flattenData`: Flattened array of items.
 *   - `totalCount` (only for v6/Iceberg v6).
 *   - `hasNextPage`, `fetchNextPage`: Pagination helpers.
 *   - `isLoading`, `status`: Loading & status indicators.
 *   - `sorting`, `setSorting`: Sorting state management.
 *   - `filters`, `search`: Filter/search state.
 *
 * @example
 * ```tsx
 * function ProjectsTable() {
 *   const { flattenData, isLoading, fetchNextPage, hasNextPage } =
 *     useResources<Project>({
 *       route: '/cloud/project',
 *       queryKey: ['projects'],
 *       pageSize: 50,
 *     });
 *
 *   if (isLoading) return <Spinner />;
 *   return (
 *     <Table
 *       rows={flattenData}
 *       onLoadMore={hasNextPage ? fetchNextPage : undefined}
 *     />
 *   );
 * }
 * ```
 */
// eslint-disable-next-line max-lines-per-function
export function useResources<T extends Record<string, unknown> = Record<string, unknown>>(
  params: UseResourcesParams<T>,
): ResourcesFacadeResult<T> {
  const api = APP_FEATURES.listingApi;

  if (api === 'v6Iceberg') {
    const response = useResourcesIcebergV6<T>({
      route: params.route,
      queryKey: params.queryKey,
      pageSize: params.pageSize,
      defaultSorting: params.defaultSorting,
      shouldFetchAll: params.shouldFetchAll,
      columns: params.columns,
      disableCache: params.disableCache,
    });
    return {
      flattenData: response.flattenData,
      totalCount: response.totalCount,
      hasNextPage: response.hasNextPage,
      fetchNextPage: response.fetchNextPage,
      isLoading: response.isLoading,
      status: response.status,
      sorting: response.sorting,
      setSorting: response.setSorting,
      filters: response.filters,
      search: response.search,
    };
  }

  if (api === 'v2') {
    const response = useResourcesIcebergV2<T>({
      route: params.route,
      queryKey: params.queryKey,
      pageSize: params.pageSize,
      defaultSorting: params.defaultSorting,
      shouldFetchAll: params.shouldFetchAll,
      columns: params.columns,
      disableCache: params.disableCache,
    });

    // Note: Iceberg v2 does not provide a total count.
    return {
      flattenData: response.flattenData,
      hasNextPage: response.hasNextPage,
      fetchNextPage: response.fetchNextPage,
      isLoading: response.isLoading,
      status: response.status,
      sorting: response.sorting,
      setSorting: response.setSorting,
      filters: response.filters,
      search: response.search,
    };
  }

  // Fallback: plain v6 list (no Iceberg).
  const response = useResourcesV6<T>({
    route: params.route,
    queryKey: params.queryKey,
    pageSize: params.pageSize,
    columns: params.columns ?? [],
    defaultSorting: params.defaultSorting,
  });
  return {
    flattenData: response.flattenData,
    totalCount: response.totalCount,
    hasNextPage: response.hasNextPage,
    fetchNextPage: response.fetchNextPage,
    isLoading: response.isLoading,
    status: response.status,
    sorting: response.sorting,
    setSorting: response.setSorting,
    filters: response.filters,
    search: response.search,
  };
}
