/* eslint-disable max-lines-per-function */
import { useCallback, useEffect, useMemo } from 'react';

import {
  InfiniteData,
  QueryKey,
  keepPreviousData,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { Filter } from '@ovh-ux/manager-core-api';

import { sharesQueryKey } from '@/adapters/shares/queryKeys';
import { getShares } from '@/data/api/shares.api';
import { TShare } from '@/domain/entities/share.entity';
import { useProjectId } from '@/hooks/useProjectId';
import { SelectOption } from '@/types/select-option';

export type FilterWithField = Filter & { field: 'name' | 'region' | 'shareID' };

export type TUseSharesQueryParams = Readonly<{
  limit: number;
  sort: 'creationDate' | 'name' | 'region' | 'size';
  sortOrder: 'asc' | 'desc';
  filters: FilterWithField[];
}>;

const defaultQueryParams: TUseSharesQueryParams = {
  limit: 10,
  sort: 'name',
  sortOrder: 'asc',
  filters: [],
};

const flattenInfinitePages = (data: InfiniteData<TShare[], number>, pageSize: number): TShare[] =>
  data.pages.flatMap((page) => (page.length > pageSize ? page.slice(0, pageSize) : page));

export const useShares = <TData = TShare[]>(
  options?: SelectOption<TShare[], TData> & {
    queryParams?: Partial<TUseSharesQueryParams>;
  },
) => {
  const projectId = useProjectId();
  const queryClient = useQueryClient();

  const { limit, sort, sortOrder, filters } = useMemo(
    () => ({ ...defaultQueryParams, ...options?.queryParams }),
    [options?.queryParams],
  );

  const queryKey = useMemo(() => {
    const firstFilter = filters?.[0];
    const filtersQueryKey = firstFilter
      ? [
          'filter',
          firstFilter?.field,
          firstFilter?.comparator,
          firstFilter?.value as string,
        ].filter(Boolean)
      : [];

    return sharesQueryKey(projectId, [
      'list',
      'sort',
      sort,
      sortOrder,
      'limit',
      String(limit),
      ...filtersQueryKey,
    ]);
  }, [projectId, sort, sortOrder, limit, filters]);

  const select = useCallback(
    (rawData: InfiniteData<TShare[], number>) => {
      const flattened = flattenInfinitePages(rawData, limit);
      return options?.select ? options.select(flattened) : flattened;
    },
    [limit, options],
  );

  const invalidateQuery = useCallback(
    async (queryKeyToInvalidate: QueryKey) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeyToInvalidate,
        exact: true,
      });
    },
    [queryClient],
  );

  const resetQueryCacheData = useCallback(
    (cacheQueryKey: QueryKey, previousData: InfiniteData<TShare[]>) => {
      queryClient.setQueryData<InfiniteData<TShare[]>>(cacheQueryKey, {
        pages: previousData.pages.slice(0, 1),
        pageParams: [0],
      });
    },
    [queryClient],
  );

  useEffect(() => {
    const queryData = queryClient.getQueryData<InfiniteData<TShare[]>>(queryKey);
    if (queryData?.pageParams && queryData.pageParams.length > 1) {
      resetQueryCacheData(queryKey, queryData);
      void invalidateQuery(queryKey);
    }
  }, [
    projectId,
    sort,
    sortOrder,
    queryClient,
    queryKey,
    filters.length,
    invalidateQuery,
    resetQueryCacheData,
  ]);

  /* eslint-disable @tanstack/query/exhaustive-deps */
  const infiniteQuery = useInfiniteQuery({
    queryKey,
    retry: false,
    initialPageParam: 0,
    enabled: !!projectId,
    refetchOnWindowFocus: 'always',
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    queryFn: ({ pageParam }) =>
      getShares(projectId, {
        limit: limit + 1,
        sort,
        sortOrder,
        offset: pageParam * limit,
        ...(filters.length > 0 && { searchField: filters[0]?.field }),
        ...(filters.length > 0 && {
          searchValue: filters[0]?.value as string,
        }),
      }),
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.length > limit ? lastPageParam + 1 : undefined,
    select,
    placeholderData: keepPreviousData,
    throwOnError: true,
  });
  /* eslint-enable @tanstack/query/exhaustive-deps */

  return {
    data: infiniteQuery.data,
    error: infiniteQuery.error,
    fetchNextPage: infiniteQuery.fetchNextPage,
    fetchPreviousPage: infiniteQuery.fetchPreviousPage,
    hasNextPage: infiniteQuery.hasNextPage,
    hasPreviousPage: infiniteQuery.hasPreviousPage,
    isError: infiniteQuery.isError,
    isFetching: infiniteQuery.isFetching,
    isFetchingNextPage: infiniteQuery.isFetchingNextPage,
    isFetchingPreviousPage: infiniteQuery.isFetchingPreviousPage,
    isPending: infiniteQuery.isPending,
    isLoading: infiniteQuery.isLoading,
    isSuccess: infiniteQuery.isSuccess,
    refetch: infiniteQuery.refetch,
    status: infiniteQuery.status,
  };
};
