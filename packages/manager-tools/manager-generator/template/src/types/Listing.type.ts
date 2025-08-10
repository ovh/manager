/**
 * Listing.types.ts
 * -----------------------------------------------------------------------------
 * Shared type definitions for listing items, paginated results,
 * and normalized data returned by hooks/components.
 */

/**
 * Minimal shape of a listing item.
 *
 * @remarks
 * Each item must have a unique `id`, with optional `name` and `status`.
 */
export type ListingItemType = {
  /** Unique identifier of the item. */
  id: string;
  /** Optional display name. */
  name?: string;
  /** Optional status string (e.g., `"active"`, `"disabled"`). */
  status?: string;
};

/**
 * Result type returned by `useListingData`.
 *
 * @typeParam T - Item type (must extend {@link ListingItemType}).
 *
 * @remarks
 * Provides a normalized shape for Datagrid consumers.
 */
export type ListingDataResultType<T> = {
  /** Flattened array of items across all loaded pages. */
  items: T[];
  /**
   * Always a number:
   * - v6 → true total count.
   * - v2 → falls back to `items.length` when unknown.
   */
  total: number;
  /** Whether data is currently loading. */
  isLoading: boolean;
  /** True if more pages are available. */
  hasNextPage: boolean;
  /** Function to load the next page, if applicable. */
  fetchNextPage?: () => void;
};

/**
 * Default listing item type.
 *
 * @remarks
 * Useful for generic listings when only `id`, `name`, and `status` are needed.
 */
export type DefaultListingItemType = ListingItemType & {
  name?: string;
  status?: string;
};

/**
 * Single page of listing items (internal pagination result).
 *
 * @typeParam T - Item type (must extend {@link ListingItemType}).
 */
export type ListingItemPageType<T extends ListingItemType> = {
  /** Items in this page. */
  data: T[];
  /** Optional HTTP-like status code for this fetch. */
  status?: number;
  /** Total number of items across all pages (if known). */
  totalCount: number;
};

/**
 * Result type for listing page fetchers (`getListingPage` etc.).
 *
 * @typeParam T - Item type.
 *
 * @remarks
 * Used to normalize different API strategies (Iceberg v6, Iceberg v2, plain v6).
 */
export type ListingPageResult<T> = {
  /** Items returned in this page. */
  data: T[];
  /**
   * Total number of items.
   * - v6: real total.
   * - v2: unknown → set to `Infinity` (callers may fallback to `items.length`).
   */
  totalCount: number;
  /** v2: returned cursor for fetching the next page. */
  cursorNext?: string;
  /** Optional HTTP-like status code. */
  status?: number;
};
