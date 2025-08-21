import {
  InfiniteData,
  keepPreviousData,
  Query,
  QueryClient,
  QueryKey,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';
import { useProjectUrl } from '@ovh-ux/manager-react-components';
import { Filter } from '@ovh-ux/manager-core-api';
import { isEqual } from 'lodash';
import fp from 'lodash/fp';
import { getInstances } from '@/data/api/instance';
import { instancesQueryKey } from '@/utils';
import { TAggregatedInstanceDto } from '@/types/instance/api.type';
import {
  TAggregatedInstance,
  TPartialInstance,
} from '@/types/instance/entity.type';
import { instancesSelector } from './selectors/instances.selector';
import { useProjectId } from '@/hooks/project/useProjectId';
import { DeepReadonly } from '@/types/utils.type';
import { buildPartialAggregatedInstanceDto } from './builder/instanceDto.builder';
import { updateInstanceFromCache } from './useInstance';

type FilterWithLabel = Filter & { label: string };

export type TUseInstancesQueryParams = DeepReadonly<{
  limit: number;
  sort: string;
  sortOrder: 'asc' | 'desc';
  filters: FilterWithLabel[];
}>;

type TUpdateInstancesFromCache = (
  queryClient: QueryClient,
  payload: {
    projectId: string;
    instance: TPartialInstance;
  },
) => void;

const listQueryKeyPredicate = (projectId: string) => (query: Query) =>
  instancesQueryKey(projectId, ['list']).every((elt) =>
    query.queryKey.includes(elt),
  );

export const updateInstancesFromCache: TUpdateInstancesFromCache = (
  queryClient: QueryClient,
  { projectId, instance },
) => {
  const queries = queryClient.getQueriesData<
    InfiniteData<TAggregatedInstanceDto[]>
  >({
    predicate: listQueryKeyPredicate(projectId),
  });
  const newInstance = buildPartialAggregatedInstanceDto(instance);

  queries.forEach(([queryKey, queryData]) => {
    if (!queryData) return;

    const updatedPages: TAggregatedInstanceDto[][] = queryData.pages.map(
      (page): TAggregatedInstanceDto[] => {
        const foundIndex = fp.findIndex(fp.propEq('id', newInstance.id), page);
        if (foundIndex === -1) return page;

        const previousInstance = page[foundIndex];
        const mergedInstance = { ...previousInstance, ...newInstance };

        if (isEqual(previousInstance, mergedInstance)) return page;

        return fp.update(
          foundIndex,
          () => mergedInstance,
          page,
        ) as TAggregatedInstanceDto[];
      },
    );

    const isPageModified = updatedPages.some(
      (page, i) => page !== queryData.pages[i],
    );

    if (!isPageModified) return;

    queryClient.setQueryData<InfiniteData<TAggregatedInstanceDto[], number>>(
      queryKey,
      (prevData) => {
        if (!prevData) return undefined;
        return { ...prevData, pages: updatedPages };
      },
    );
  });

  updateInstanceFromCache({
    queryClient,
    projectId,
    instance,
  });
};

const getPendingTasks = (data?: TAggregatedInstance[]) =>
  data
    ?.filter(({ pendingTask }) => pendingTask)
    .map(({ id, region }) => ({ instanceId: id, region })) ?? [];

export const getAggregatedInstanceById = (
  projectId: string,
  id: string | undefined,
  queryClient: QueryClient,
): TAggregatedInstanceDto | undefined => {
  if (!id) return undefined;

  const data = queryClient.getQueriesData<
    InfiniteData<TAggregatedInstanceDto[], number>
  >({
    predicate: listQueryKeyPredicate(projectId),
  });

  return data.reduce((acc: TAggregatedInstanceDto | undefined, [, result]) => {
    if (acc) return acc;
    if (result) {
      const foundInstance = result.pages.flat().find((elt) => elt.id === id);
      return foundInstance ?? acc;
    }
    return acc;
  }, undefined);
};

const getInconsistency = (data: TAggregatedInstance[] | undefined): boolean =>
  !!data?.some((elt) => elt.status.label === 'UNKNOWN');

export const useInstances = ({
  limit,
  sort,
  sortOrder,
  filters,
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
