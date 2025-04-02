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
import { Filter } from '@ovh-ux/manager-core-api';
import { getInstances } from '@/data/api/instance';
import { instancesQueryKey } from '@/utils';
import { TInstanceDto, TInstanceStatusDto } from '@/types/instance/api.type';
import {
  TInstanceStatusSeverity,
  TInstanceStatus,
  TInstanceAddressType,
  TAddress,
  TInstance,
  TInstanceAction,
} from '@/types/instance/entity.type';
import { DeepReadonly } from '@/types/utils.type';
import { TActionName } from '@/types/instance/common.type';

type FilterWithLabel = Filter & { label: string };

export type TUseInstancesQueryParams = DeepReadonly<{
  limit: number;
  sort: string;
  sortOrder: 'asc' | 'desc';
  filters: FilterWithLabel[];
}>;

const listQueryKeyPredicate = (projectId: string) => (query: Query) =>
  instancesQueryKey(projectId, ['list']).every((elt) =>
    query.queryKey.includes(elt),
  );

export const updateDeletedInstanceStatus = (
  projectId: string,
  queryClient: QueryClient,
  instanceId?: string | null,
) => {
  if (!instanceId) return;
  queryClient.setQueriesData<InfiniteData<TInstanceDto[], number>>(
    {
      predicate: listQueryKeyPredicate(projectId),
    },
    (prevData) => {
      if (!prevData) return undefined;
      const updatedPages = prevData.pages.map((page) =>
        page.map((instance) =>
          instance.id === instanceId
            ? { ...instance, status: 'DELETING' as TInstanceStatusDto }
            : instance,
        ),
      );
      return { ...prevData, pages: updatedPages };
    },
  );
};

export const getInstanceNameById = (
  projectId: string,
  id: string | undefined,
  queryClient: QueryClient,
): string | undefined => {
  if (!id) return undefined;

  const data = queryClient.getQueriesData<InfiniteData<TInstanceDto[], number>>(
    {
      predicate: listQueryKeyPredicate(projectId),
    },
  );
  return data.reduce((acc, [, result]) => {
    if (acc.length) return acc;
    if (result)
      return result.pages.flat().find((elt) => elt.id === id)?.name ?? acc;
    return acc;
  }, '');
};

const buildInstanceStatusSeverity = (
  status: TInstanceStatusDto,
): TInstanceStatusSeverity => {
  switch (status) {
    case 'BUILDING':
    case 'REBOOT':
    case 'REBUILD':
    case 'REVERT_RESIZE':
    case 'SOFT_DELETED':
    case 'VERIFY_RESIZE':
    case 'MIGRATING':
    case 'RESIZE':
    case 'BUILD':
    case 'SHUTOFF':
    case 'RESCUE':
    case 'SHELVED':
    case 'SHELVED_OFFLOADED':
    case 'RESCUING':
    case 'UNRESCUING':
    case 'SNAPSHOTTING':
    case 'RESUMING':
    case 'HARD_REBOOT':
    case 'PASSWORD':
    case 'PAUSED':
      return 'warning';
    case 'DELETED':
    case 'ERROR':
    case 'STOPPED':
    case 'SUSPENDED':
    case 'UNKNOWN':
      return 'error';
    case 'ACTIVE':
    case 'RESCUED':
    case 'RESIZED':
      return 'success';
    default:
      return 'info';
  }
};
const getInstanceStatus = (status: TInstanceStatusDto): TInstanceStatus => ({
  state: status,
  severity: buildInstanceStatusSeverity(status),
});

const getInconsistency = (data: TInstance[] | undefined): boolean =>
  !!data?.some((elt) => elt.status.state === 'UNKNOWN');

const getActionHrefByName = (
  projectUrl: string,
  name: TActionName,
  { region, id }: Pick<TInstance, 'id' | 'region'>,
): TInstanceAction['link'] => {
  if (name === 'details') {
    return { path: id, isExternal: false };
  }

  if (name === 'create_autobackup') {
    return { path: `${projectUrl}/workflow/new`, isExternal: true };
  }

  const actions = new Set(['delete', 'stop', 'start', 'shelve', 'unshelve']);
  if (actions.has(name)) {
    return {
      path: `region/${region}/instance/${id}/${name}`,
      isExternal: false,
    };
  }

  return { path: '', isExternal: false };
};

const mapInstanceActions = (
  instance: TInstanceDto,
  projectUrl: string,
): TInstanceAction[] =>
  instance.actions.map((action) => ({
    ...action,
    link: getActionHrefByName(projectUrl, action.name, instance),
  }));

export const instancesSelector = (
  { pages }: InfiniteData<TInstanceDto[], number>,
  limit: number,
  projectUrl: string,
): TInstance[] =>
  pages
    .flatMap((page) => (page.length > limit ? page.slice(0, limit) : page))
    .map((instanceDto) => ({
      ...instanceDto,
      status: getInstanceStatus(instanceDto.status),
      addresses: instanceDto.addresses.reduce((acc, { type, ...rest }) => {
        const foundAddresses = acc.get(type);
        const ipAlreadyExists = !!foundAddresses?.find(
          ({ ip }) => ip === rest.ip,
        );
        if (foundAddresses) {
          if (ipAlreadyExists) return acc.set(type, [...foundAddresses]);
          return acc.set(type, [...foundAddresses, rest]);
        }
        return acc.set(type, [rest]);
      }, new Map<TInstanceAddressType, TAddress[]>()),
      actions: mapInstanceActions(instanceDto, projectUrl),
    }));

export const useInstances = (
  projectId: string,
  projectUrl: string,
  { limit, sort, sortOrder, filters }: TUseInstancesQueryParams,
) => {
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
        ...(filters.length > 0 && { searchValue: filters[0].value as string }),
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
    refresh,
    ...rest,
  };
};
