import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';
import {
  IcebergFetchParamsV2,
  IcebergFetchResultV2,
  fetchIcebergV2,
  Filter,
  ApiError,
} from '@ovh-ux/manager-core-api';
import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { ColumnSort, useColumnFilters } from '@ovh-ux/manager-react-components';
import {
  commonFilterToNotificationFilter,
  commonSortingToNotificationSorting,
} from '@/utils/queryParam';
import { Notification, NotificationReference } from '@/data/types';
import {
  getNotification,
  getNotificationReference,
} from '@/data/api/notification';

const defaultPageSize = 10;

type FilterWithLabel = Filter & {
  label: string;
};
type Filters = {
  filters: FilterWithLabel[];
  add: (filter: FilterWithLabel) => void;
  remove: (filter: FilterWithLabel) => void;
};

type Search = {
  onSearch: (search: string) => void;
  searchInput: string;
  setSearchInput: Dispatch<SetStateAction<string>>;
};

export type UseNotificationHistoryResult = {
  flattenData: Notification[];
  setSorting: Dispatch<SetStateAction<ColumnSort>>;
  sorting: ColumnSort;
  filters: Filters;
  search: Search;
} & UseInfiniteQueryResult<
  InfiniteData<IcebergFetchResultV2<Notification>>,
  Error
>;

export type UseNotificationHistoryParams = {
  defaultSorting?: ColumnSort;
  sort?: (sorting: ColumnSort, data: Notification[]) => Notification[];
  shouldFetchAll?: boolean;
} & Omit<
  UseInfiniteQueryOptions<IcebergFetchResultV2<Notification>>,
  'queryFn' | 'getNextPageParam' | 'initialPageParam' | 'select' | 'queryKey'
>;

export const API_V2_MAX_PAGE_SIZE = 9999;

export function useNotificationHistory({
  pageSize = defaultPageSize,
  shouldFetchAll = false,
  ...options
}: Omit<IcebergFetchParamsV2, 'route'> &
  UseNotificationHistoryParams): UseNotificationHistoryResult {
  const [flattenData, setFlattenData] = useState<Notification[]>([]);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [searchInput, setSearchInput] = useState('');

  const [sorting, setSorting] = useState<ColumnSort>({
    id: 'createdAt',
    desc: true,
  });
  const { filters, addFilter, removeFilter } = useColumnFilters();

  const queryConfig = useMemo<string[]>(() => {
    return [
      ...commonFilterToNotificationFilter(filters),
      commonSortingToNotificationSorting(sorting),
      searchFilter,
    ].filter(Boolean);
  }, [filters, sorting, searchFilter]);

  const searchParams = useMemo<string>(() => {
    if (queryConfig.length === 0) return '';
    return `?${queryConfig.join('&')}`;
  }, [queryConfig]);

  const query = useInfiniteQuery({
    staleTime: Infinity,
    retry: false,
    ...options,
    initialPageParam: null,
    queryKey: [
      'notification/history',
      shouldFetchAll ? 'all' : pageSize,
      ...queryConfig,
    ].filter(Boolean),
    queryFn: ({ pageParam }) =>
      fetchIcebergV2<Notification>({
        route: `/notification/history${searchParams}`,
        pageSize: shouldFetchAll ? API_V2_MAX_PAGE_SIZE : pageSize,
        cursor: pageParam as string,
      }),
    getNextPageParam: (lastPage) => lastPage.cursorNext,
  });

  useEffect(() => {
    const flatten = query.data?.pages.flatMap((page) => page.data) || [];
    setFlattenData(flatten);

    if (shouldFetchAll && query.hasNextPage) {
      query.fetchNextPage();
    }
  }, [query.data]);

  const onSearch = useCallback(
    (search: string) => {
      if (search.trim().length === 0) {
        setSearchFilter('');
        setSearchInput('');
      }
      setSearchFilter(`titleContains=${search}`);
    },
    [searchInput],
  );

  return {
    ...query,
    flattenData,
    setSorting,
    sorting,
    filters: {
      filters,
      add: addFilter,
      remove: removeFilter,
    },
    search: {
      onSearch,
      searchInput,
      setSearchInput,
    },
  };
}

export type UseNotificationParams = {
  notificationId?: string;
  enabled?: boolean;
};
export const useNotification = ({
  notificationId,
  enabled = true,
}: UseNotificationParams): UseQueryResult<Notification, ApiError> =>
  useQuery({
    queryKey: [`notification/history/${notificationId}`],
    queryFn: () => getNotification(notificationId as string),
    enabled: Boolean(notificationId && enabled),
  });

export const useNotificationReference = (): UseQueryResult<
  NotificationReference,
  ApiError
> =>
  useQuery({
    queryKey: ['notification/reference'],
    queryFn: () => getNotificationReference(),
  });
