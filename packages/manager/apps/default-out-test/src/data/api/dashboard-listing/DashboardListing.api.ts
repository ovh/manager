import { makeClient } from '@/data/api/commons/Client.api';
import { ListingItemPageType, ListingItemType } from '@/types/Listing.type';

/**
 * Fetches a paginated list of items using the API pattern
 * defined in {@link APP_FEATURES.listingApi}.
 *
 * This function delegates to {@link makeClient} and chooses between
 * mock or live mode based on the `VITE_DATA_MODE` environment variable.
 *
 * @template T - The type of each listing item. Defaults to {@link ListingItemType}.
 *
 * @param params - The listing query parameters.
 * @param params.page - Page number to retrieve (1-based).
 * @param params.pageSize - Number of items to retrieve per page.
 *
 * @returns A Promise that resolves to a {@link ListingItemPageType} containing:
 * - `data`: the array of items for the requested page.
 * - `status`: HTTP-like status code (200 in mock mode).
 * - `totalCount`: total number of available items.
 *
 * @example
 * ```ts
 * const result = await getListing({
 *   page: 1,
 *   pageSize: 20,
 * });
 * console.log(result.data); // array of 20 items
 * ```
 */
export function getListing<T extends ListingItemType = ListingItemType>({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}): Promise<ListingItemPageType<T>> {
  const client = makeClient({
    dataMode: import.meta.env.VITE_DATA_MODE === 'live' ? 'live' : 'mock',
  });

  return client.getListing<T>({
    route: '/services',
    page,
    pageSize,
  });
}
