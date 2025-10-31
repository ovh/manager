import {
  InfiniteData,
  keepPreviousData,
  QueryKey,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import type { Filter } from '@ovh-ux/manager-core-api';

import { APP_FEATURES } from '@/App.constants';
import { nashaQueryKey } from './utils/queryKeys';
import type { NashaServiceDto } from '@/types/Nasha.api.type';
import type { NashaService } from '@/types/Nasha.type';

/**
 * Check if user has any Nasha services
 */
export function useNashaServicesCheck() {
  return useQuery({
    queryKey: nashaQueryKey(['check']),
    queryFn: async () => {
      const result = await fetchIcebergV6<NashaServiceDto>({
        route: APP_FEATURES.listingEndpoint,
        page: 1,
        pageSize: 1,
      });
      return {
        hasServices: result.data.length > 0,
        totalCount: result.totalCount,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

export type UseNashaServicesParams = {
  limit: number;
  sortBy?: string;
  sortDesc?: boolean;
  filters?: Filter[];
};

/**
 * Hook to fetch Nasha services with pagination
 * Uses InfiniteQuery with server-side pagination and selectors for data transformation
 */
export function useNashaServices(params: UseNashaServicesParams) {
  const queryClient = useQueryClient();

  // Structured query keys with useMemo for optimization
  const filtersQueryKey = useMemo(
    () =>
      params.filters && params.filters.length > 0
        ? ([
            'filter',
            params.filters[0]?.key,
            params.filters[0]?.comparator,
            params.filters[0]?.value as string,
          ].filter(Boolean) as (string | number)[])
        : [],
    [params.filters],
  );

  const queryKey = useMemo(
    () =>
      nashaQueryKey([
        'list',
        'sort',
        params.sortBy || '',
        params.sortDesc ? 'desc' : 'asc',
        ...filtersQueryKey,
      ]),
    [filtersQueryKey, params.sortBy, params.sortDesc],
  );

  // Cache invalidation helper
  const invalidateQuery = useCallback(
    async (queryKeyToInvalidate: QueryKey) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeyToInvalidate,
        exact: true,
      });
    },
    [queryClient],
  );

  // Refresh function to reload data
  const refresh = useCallback(() => {
    invalidateQuery(queryKey).then(() => undefined);
  }, [invalidateQuery, queryKey]);

  // Reset query cache data helper
  const resetQueryCacheData = useCallback(
    (
      cacheQueryKey: QueryKey,
      previousData: InfiniteData<NashaService[], number>,
    ) => {
      queryClient.setQueryData<InfiniteData<NashaService[], number>>(
        cacheQueryKey,
        {
          pages: previousData.pages.slice(0, 1),
          pageParams: [0],
        },
      );
    },
    [queryClient],
  );

  // InfiniteQuery with selector for data transformation
  const { data, hasNextPage, fetchNextPage, ...rest } = useInfiniteQuery<
    { data: NashaServiceDto[]; totalCount: number },
    Error,
    InfiniteData<NashaService[], number>,
    QueryKey,
    number
  >({
    queryKey,
    retry: false,
    initialPageParam: 0,
    refetchOnWindowFocus: 'always',
    queryFn: ({ pageParam }) =>
      fetchIcebergV6<NashaServiceDto>({
        route: APP_FEATURES.listingEndpoint,
        page: pageParam + 1, // API uses 1-based pagination
        pageSize: params.limit,
        filters: params.filters,
        sortBy: params.sortBy,
        sortReverse: params.sortDesc,
      }).then((result) => ({
        data: result.data,
        totalCount: result.totalCount,
      })),
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      // Check if we have more data based on totalCount
      const totalFetched = allPages.reduce((sum, page) => sum + page.data.length, 0);
      const { totalCount } = lastPage;

      // If we've fetched all available data, no next page
      if (totalCount !== undefined && totalFetched >= totalCount) {
        return undefined;
      }

      // If last page has fewer items than limit, we're done
      if (lastPage.data.length < params.limit) {
        return undefined;
      }

      // Otherwise, there might be more pages
      return lastPageParam + 1;
    },
    // Selector separates fetch logic from transformation
    select: useCallback(
      (
        rawData: InfiniteData<
          { data: NashaServiceDto[]; totalCount: number },
          number
        >,
      ): InfiniteData<NashaService[], number> => {
        const transformedPages = rawData.pages.map((page) =>
          page.data.map((dto) => {
            return {
              serviceName: dto.serviceName,
              canCreatePartition: dto.canCreatePartition,
              customName: dto.customName,
              datacenter: dto.datacenter,
              diskType: dto.diskType,
              monitored: dto.monitored,
              zpoolCapacity: dto.zpoolCapacity,
              zpoolSize: dto.zpoolSize,
            } as NashaService;
          }),
        );
        return {
          pages: transformedPages,
          pageParams: rawData.pageParams,
        };
      },
      [],
    ),
    placeholderData: keepPreviousData,
  });

  // Get total count from API response (first page contains the total)
  // Get it directly from the query cache which is reactive
  const totalCount = useMemo(() => {
    const rawQueryData = queryClient.getQueryData<
      InfiniteData<{ data: NashaServiceDto[]; totalCount: number }, number>
    >(queryKey);
    const count = rawQueryData?.pages[0]?.totalCount;
    // Return count if available, otherwise undefined (will use fallback in component)
    return count;
  }, [queryClient, queryKey, data?.pages?.length]);

  // Flatten data for easier consumption
  const flattenData = useMemo(() => {
    if (!data) return [];
    return data.pages.flat();
  }, [data]);

  // Calculate hasNextPage based on fetched data vs totalCount
  const calculatedHasNextPage = useMemo(() => {
    if (!totalCount) return hasNextPage ?? false;
    const fetchedCount = flattenData.length;
    return fetchedCount < totalCount;
  }, [flattenData.length, totalCount, hasNextPage]);

  return {
    data: flattenData,
    totalCount,
    refresh,
    invalidateQuery,
    resetQueryCacheData,
    hasNextPage: calculatedHasNextPage,
    fetchNextPage,
    ...rest,
  };
}
