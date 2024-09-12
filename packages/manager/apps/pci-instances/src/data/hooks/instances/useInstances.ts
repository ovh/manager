import { ApiError } from '@ovh-ux/manager-core-api';
import {
  InfiniteData,
  keepPreviousData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useQueryClient,
} from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';
import { FilterWithLabel } from '@ovh-ux/manager-react-components/src/components/filters/interface';
import {
  InstanceDto,
  retrieveInstances,
  InstanceStatusDto,
} from '@/data/api/instances';
import { instancesQueryKey } from '@/utils';
import { DeepReadonly } from '@/types/utils.type';

type UseInstancesResult = UseInfiniteQueryResult<
  Instance[] | undefined,
  ApiError
> & {
  hasInconsistency: boolean;
};

export type UseInstances = (
  projectId: string,
  params: UseInstancesQueryParams,
) => UseInstancesResult;

export type UseInstancesQueryParams = DeepReadonly<{
  limit: number;
  sort: string;
  sortOrder: 'asc' | 'desc';
  filters: FilterWithLabel[];
}>;

export type InstanceId = string;
export type FlavorId = string;
export type ImageId = string;
export type AddressType = 'public' | 'private';

export type InstanceStatusSeverity = 'success' | 'error' | 'warning' | 'info';
export type InstanceStatusState = InstanceStatusDto;
export type InstanceStatus = {
  state: InstanceStatusState;
  severity: InstanceStatusSeverity;
};

export type Address = {
  ip: string;
  version: number;
  gatewayIp: string;
};

export type Instance = DeepReadonly<{
  id: InstanceId;
  name: string;
  flavorId: FlavorId;
  flavorName: string;
  status: InstanceStatus;
  region: string;
  imageId: ImageId;
  imageName: string;
  addresses: Map<AddressType, Address[]>;
}>;

const buildInstanceStatusSeverity = (
  status: InstanceStatusDto,
): InstanceStatusSeverity => {
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
const getInstanceStatus = (status: InstanceStatusDto): InstanceStatus => ({
  state: status,
  severity: buildInstanceStatusSeverity(status),
});

const getInconsistency = (data: Instance[] | undefined): boolean =>
  !!data?.some((elt) => elt.status.state === 'UNKNOWN');

export const instancesSelector = (
  { pages }: InfiniteData<InstanceDto[], number>,
  limit: number,
): Instance[] =>
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
      }, new Map<AddressType, Address[]>()),
    }));

export const useInstances = (
  projectId: string,
  { limit, sort, sortOrder, filters }: UseInstancesQueryParams,
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

  const refresh = useCallback(() => {
    queryClient.removeQueries({
      predicate: (query) =>
        query.queryKey.includes('list') &&
        query.queryKey !==
          instancesQueryKey(projectId, ['list', 'sort', 'name', 'asc']),
    });
  }, [projectId, queryClient]);

  useEffect(() => {
    const queryData = queryClient.getQueryData<InfiniteData<Instance[]>>(
      queryKey,
    );
    if (queryData?.pageParams && queryData.pageParams.length > 1) {
      queryClient.resetQueries({
        queryKey,
        exact: true,
      });
    }
  }, [projectId, sort, sortOrder, queryClient, queryKey, filters.length]);

  const { data, ...rest } = useInfiniteQuery({
    queryKey,
    retry: false,
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.length > limit ? lastPageParam + 1 : null,
    queryFn: ({ pageParam }) =>
      retrieveInstances(projectId, {
        limit,
        sort,
        sortOrder,
        offset: pageParam * limit,
        ...(filters.length > 0 && { searchField: filters[0].label }),
        ...(filters.length > 0 && { searchValue: filters[0].value as string }),
      }),
    select: useCallback(
      (rawData: InfiniteData<InstanceDto[], number>) =>
        instancesSelector(rawData, limit),
      [limit],
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
