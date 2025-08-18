import { useMemo } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';

import { getListing } from '@/data/api/dashboard-listing/DashboardListing.api';
import { ListingDataResultType, ListingItemPageType, ListingItemType } from '@/types/Listing.type';

const PAGE_SIZE = 20;
const QUERY_KEY = ['listing'] as const;

export function useListingData<
  T extends ListingItemType = ListingItemType,
>(): ListingDataResultType<T> {
  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery<
    ListingItemPageType<T>,
    Error
  >({
    initialData: undefined,
    initialPageParam: undefined,
    queryKey: QUERY_KEY,
    queryFn: ({ pageParam = 1 }) =>
      getListing<T>({
        page: Number(pageParam),
        pageSize: PAGE_SIZE,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce<number>((acc, p) => acc + p.data.length, 0);
      return loaded < lastPage.totalCount ? allPages.length + 1 : undefined;
    },
    staleTime: 60_000,
  });

  const items: T[] = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((p: ListingItemPageType<T>) => p.data);
  }, [data]);

  const total: number = data?.pages?.[0]?.totalCount ?? 0;

  return useMemo<ListingDataResultType<T>>(() => {
    const next: ListingDataResultType<T>['fetchNextPage'] = hasNextPage
      ? () => {
          void fetchNextPage();
        }
      : undefined;

    return {
      items,
      total,
      isLoading,
      hasNextPage: Boolean(hasNextPage),
      fetchNextPage: next,
    };
  }, [items, total, isLoading, hasNextPage, fetchNextPage]);
}
