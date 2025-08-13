import {
  InfiniteData,
  keepPreviousData,
  QueryKey,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';
import { useProjectUrl } from '@ovh-ux/manager-react-components';
import { Filter } from '@ovh-ux/manager-core-api';
import { getInstances } from '@/data/api/instance';
import { instancesQueryKey } from '@/utils';
import { TAggregatedInstanceDto } from '@/types/instance/api.type';
import { TAggregatedInstance } from '@/types/instance/entity.type';
import { instancesSelector } from './selectors/instances.selector';
import { useProjectId } from '@/hooks/project/useProjectId';
import { DeepReadonly } from '@/types/utils.type';
import { listQueryKeyPredicate } from '@/adapters/tanstack-query/store/instances/queryKeys';

type FilterWithLabel = Filter & { label: string };

export type TUseInstancesQueryParams = DeepReadonly<{
  limit: number;
  sort: string;
  sortOrder: 'asc' | 'desc';
  filters: FilterWithLabel[];
  forceRefetch?: boolean;
}>;

export type TInstanceArgs = {
  projectId: string;
  instanceId: string;
  region: string;
};

const getPendingTasks = (data?: TAggregatedInstance[]) =>
  data
    ?.filter(({ pendingTask }) => pendingTask)
    .map(({ id, region }) => ({ instanceId: id, region })) ?? [];

const getInconsistency = (data: TAggregatedInstance[] | undefined): boolean =>
  !!data?.some((elt) => elt.status.label === 'UNKNOWN');

export const useInstances = ({
  limit,
  sort,
  sortOrder,
  filters,
  forceRefetch,
}: TUseInstancesQueryParams) => {
  const projectId = useProjectId();
  const projectUrl = useProjectUrl('public-cloud');
  const queryClient = useQueryClient();
  const filtersQueryKey = useMemo(
    () =>
      filters.length > 0
        ? ([
            'filter',
            filters[0]?.label,
            filters[0]?.comparator,
            filters[0]?.value as string,
          ].filter(Boolean) as string[])
        : [],
    [filters],
  );
  const queryKey = useMemo(
    () =>
      instancesQueryKey(projectId, [
        'list',
        'sort',
        sort,
        sortOrder,
        ...filtersQueryKey,
      ]),
    [filtersQueryKey, projectId, sort, sortOrder],
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
    (
      cacheQueryKey: QueryKey,
      previousData: InfiniteData<TAggregatedInstance[]>,
    ) => {
      queryClient.setQueryData<InfiniteData<TAggregatedInstance[]>>(
        cacheQueryKey,
        {
          pages: previousData.pages.slice(0, 1),
          pageParams: [0],
        },
      );
    },
    [queryClient],
  );

  // Custom function to prevent from reloading the whole page by resetting cache only
  const refresh = useCallback(() => {
    const initialQueryKey = instancesQueryKey(projectId, [
      'list',
      'sort',
      'name',
      'asc',
    ]);

    const queryKeyEqualsInitialQueryKey = (
      currentQueryKey: QueryKey,
    ): boolean =>
      JSON.stringify(currentQueryKey) === JSON.stringify(initialQueryKey);

    const listCachedQueries = queryClient.getQueriesData({
      predicate: listQueryKeyPredicate(projectId),
    });

    const queryData = queryClient.getQueryData<
      InfiniteData<TAggregatedInstance[]>
    >(initialQueryKey);

    if (listCachedQueries.length > 1) {
      queryClient.removeQueries({
        predicate: (query) =>
          listQueryKeyPredicate(projectId)(query) &&
          !queryKeyEqualsInitialQueryKey(query.queryKey),
      });
    }

    if (queryData && queryData.pageParams.length > 1) {
      resetQueryCacheData(initialQueryKey, queryData);
    }

    void invalidateQuery(initialQueryKey);
  }, [invalidateQuery, projectId, queryClient, resetQueryCacheData]);

  useEffect(() => {
    const queryData = queryClient.getQueryData<
      InfiniteData<TAggregatedInstance[]>
    >(queryKey);
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

  const { data, ...rest } = useInfiniteQuery({
    queryKey,
    retry: false,
    initialPageParam: 0,
    refetchOnWindowFocus: 'always',
    refetchInterval: forceRefetch ? 3000 : undefined,
    queryFn: ({ pageParam }) =>
      getInstances(projectId, {
        limit,
        sort,
        sortOrder,
        offset: pageParam * limit,
        ...(filters.length > 0 && { searchField: filters[0]?.label }),
        ...(filters.length > 0 && {
          searchValue: filters[0]?.value as string,
        }),
      }),
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.length > limit ? lastPageParam + 1 : null,
    select: useCallback(
      (rawData: InfiniteData<TAggregatedInstanceDto[], number>) =>
        instancesSelector(rawData, limit, projectUrl),
      [limit, projectUrl],
    ),
    placeholderData: keepPreviousData,
  });

  return {
    data,
    hasInconsistency: getInconsistency(data),
    pendingTasks: getPendingTasks(data),
    refresh,
    ...rest,
  };
};
