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
import isEqual from 'lodash.isequal';
import { getInstances } from '@/data/api/instance';
import { instancesQueryKey } from '@/utils';
import { TInstanceDto } from '@/types/instance/api.type';
import { TInstance } from '@/types/instance/entity.type';
import { instancesSelector } from './selectors/instances.selector';
import { useProjectId } from '@/hooks/project/useProjectId';
import { DeepReadonly } from '@/types/utils.type';

type FilterWithLabel = Filter & { label: string };

export type TUseInstancesQueryParams = DeepReadonly<{
  limit: number;
  sort: string;
  sortOrder: 'asc' | 'desc';
  filters: FilterWithLabel[];
}>;

export type TUpdateInstanceFromCache = (
  queryClient: QueryClient,
  payload: {
    projectId: string;
    instance: Pick<TInstanceDto, 'id'> & Partial<TInstanceDto>;
  },
) => void;

const listQueryKeyPredicate = (projectId: string) => (query: Query) =>
  instancesQueryKey(projectId, ['list']).every((elt) =>
    query.queryKey.includes(elt),
  );

export const updateInstanceFromCache: TUpdateInstanceFromCache = (
  queryClient,
  payload,
) => {
  const { projectId, instance } = payload;

  const queries = queryClient.getQueriesData<InfiniteData<TInstanceDto[]>>({
    predicate: listQueryKeyPredicate(projectId),
  });

  queries.forEach(([queryKey, queryData]) => {
    if (!queryData) return;

    let isPageModified = false;

    const updatedPages = queryData.pages.map((page) =>
      page.map((prevInstance) => {
        if (prevInstance.id === instance.id) {
          const mergedInstance = { ...prevInstance, ...instance };
          isPageModified = !isEqual(mergedInstance, prevInstance);
          return mergedInstance;
        }
        return prevInstance;
      }),
    );

    if (!isPageModified) return;

    queryClient.setQueryData<InfiniteData<TInstanceDto[], number>>(
      queryKey,
      (prevData) => {
        if (!prevData) return undefined;
        return { ...prevData, pages: updatedPages };
      },
    );
  });
};

const getPendingTaskIds = (data?: TInstance[]): string[] =>
  data?.filter(({ pendingTask }) => pendingTask).map(({ id }) => id) ?? [];

export const getInstanceById = (
  projectId: string,
  id: string | undefined,
  queryClient: QueryClient,
): TInstanceDto | undefined => {
  if (!id) return undefined;

  const data = queryClient.getQueriesData<InfiniteData<TInstanceDto[], number>>(
    {
      predicate: listQueryKeyPredicate(projectId),
    },
  );

  return data.reduce((acc: TInstanceDto | undefined, [, result]) => {
    if (acc) return acc;
    if (result) {
      const foundInstance = result.pages.flat().find((elt) => elt.id === id);
      return foundInstance ?? acc;
    }
    return acc;
  }, undefined);
};

const getInconsistency = (data: TInstance[] | undefined): boolean =>
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
      filters?.length > 0
        ? [
            'filter',
            filters[0].label,
            filters[0].comparator,
            filters[0].value as string,
          ]
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
    (queryKeyToInvalidate: QueryKey) => {
      queryClient.invalidateQueries({
        queryKey: queryKeyToInvalidate,
        exact: true,
      });
    },
    [queryClient],
  );

  const resetQueryCacheData = useCallback(
    (cacheQueryKey: QueryKey, previousData: InfiniteData<TInstance[]>) => {
      queryClient.setQueryData<InfiniteData<TInstance[]>>(cacheQueryKey, {
        pages: previousData.pages.slice(0, 1),
        pageParams: [0],
      });
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

    const queryData = queryClient.getQueryData<InfiniteData<TInstance[]>>(
      initialQueryKey,
    );

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

    invalidateQuery(initialQueryKey);
  }, [invalidateQuery, projectId, queryClient, resetQueryCacheData]);

  useEffect(() => {
    const queryData = queryClient.getQueryData<InfiniteData<TInstance[]>>(
      queryKey,
    );
    if (queryData?.pageParams && queryData.pageParams.length > 1) {
      resetQueryCacheData(queryKey, queryData);
      invalidateQuery(queryKey);
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
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.length > limit ? lastPageParam + 1 : null,
    queryFn: ({ pageParam }) =>
      getInstances(projectId, {
        limit,
        sort,
        sortOrder,
        offset: pageParam * limit,
        ...(filters.length > 0 && { searchField: filters[0].label }),
        ...(filters.length > 0 && {
          searchValue: filters[0].value as string,
        }),
      }),
    select: useCallback(
      (rawData: InfiniteData<TInstanceDto[], number>) =>
        instancesSelector(rawData, limit, projectUrl),
      [limit, projectUrl],
    ),
    placeholderData: keepPreviousData,
  });

  return {
    data,
    hasInconsistency: getInconsistency(data),
    pendingTasks: getPendingTaskIds(data),
    refresh,
    ...rest,
  };
};
