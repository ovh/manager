/**
 * useListingData.tsx
 * -----------------------------------------------------------------------------
 * App-level listing hook that:
 * - Delegates to the `useResources` facade → automatically selects
 *   v6 Iceberg, v2 Iceberg, or plain v6 depending on `APP_FEATURES.listingApi`.
 * - Normalizes the return shape for **Datagrid consumers**.
 *
 * IMPORTANT:
 * - When the total count is unknown (Iceberg v2), this hook falls back to
 *   `items.length` to satisfy Datagrid’s required numeric `totalItems` prop.
 */
import { useMemo } from 'react';

import { APP_FEATURES } from '@/App.constants';
import { resolveListingRoute } from '@/data/api/commons/Client.utils';
import { useResources } from '@/data/api/hooks/useResources';
import { ListingDataResultType } from '@/types/Listing.type';

/**
 * Hook for retrieving listing data in a Datagrid-compatible shape.
 *
 * Internally:
 * - Resolves the API route using `resolveListingRoute`.
 * - Delegates fetching to `useResources`, which abstracts v6/v2/Iceberg.
 * - Computes a safe `total` count (fallback to `items.length` if missing).
 * - Normalizes fields for UI datagrid components.
 *
 * @typeParam T - Resource item type (defaults to generic object).
 * @returns Object containing:
 *   - `items`: Flattened array of listing items.
 *   - `total`: Total number of items (numeric, always defined).
 *   - `isLoading`: Whether data is currently loading.
 *   - `hasNextPage`: If more pages can be fetched.
 *   - `fetchNextPage`: Function to load the next page, if available.
 *
 * @example
 * ```tsx
 * import { useListingData } from '@/data/api/hooks/useListingData';
 *
 * function ProjectDatagrid() {
 *   const { items, total, isLoading, hasNextPage, fetchNextPage } =
 *     useListingData<Project>();
 *
 *   if (isLoading) return <Spinner />;
 *
 *   return (
 *     <Datagrid
 *       items={items}
 *       totalItems={total}
 *       onLoadMore={hasNextPage ? fetchNextPage : undefined}
 *     />
 *   );
 * }
 * ```
 */
export function useListingData<
  T extends Record<string, unknown> = Record<string, unknown>,
>(): ListingDataResultType<T> {
  const route = resolveListingRoute();

  // Delegate to the unified resources facade:
  const raw = useResources<T>({
    route,
    queryKey: ['listing', route, APP_FEATURES.listingApi],
  });

  return useMemo<ListingDataResultType<T>>(() => {
    const items = raw?.flattenData ?? [];
    // If totalCount is not provided (v2), use current loaded size:
    const total = typeof raw?.totalCount === 'number' ? raw.totalCount : items.length;

    const fetchNextPage =
      raw?.hasNextPage && raw?.fetchNextPage
        ? () => {
            void raw.fetchNextPage?.();
          }
        : undefined;

    return {
      items,
      total,
      isLoading: !!raw?.isLoading,
      hasNextPage: !!raw?.hasNextPage,
      fetchNextPage,
    };
  }, [raw]);
}
