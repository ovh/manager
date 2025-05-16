import {
  UseInfiniteQueryOptions,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import {
  getWebHostingAttachedDomain,
  getWebHostingAttachedDomainQueryKey,
} from '@/data/api/AttachedDomain';
import { WebsiteType } from '@/data/type';
import { buildURLSearchParams } from '@/utils';

type UseWebsitesListParams = Omit<
  UseInfiniteQueryOptions,
  'queryKey' | 'queryFn' | 'select' | 'getNextPageParam' | 'initialPageParam'
> & {
  domain?: string;
  shouldFetchAll?: boolean;
};

export const useWebHostingAttachedDomain = (
  props: UseWebsitesListParams = {},
) => {
  const { domain, ...options } = props;
  const searchParams = buildURLSearchParams({
    domain,
  });

  const query = useInfiniteQuery({
    ...options,
    initialPageParam: null,

    queryKey: getWebHostingAttachedDomainQueryKey(searchParams),
    queryFn: ({ pageParam }) =>
      getWebHostingAttachedDomain({
        pageParam: pageParam as string,
        searchParams,
        pageSize: 15,
      }),
    enabled: (q) =>
      typeof props.enabled === 'function'
        ? props.enabled(q)
        : typeof props.enabled !== 'boolean' || props.enabled,
    getNextPageParam: (lastPage: { cursorNext?: string }) =>
      lastPage.cursorNext,
    select: (data) =>
      data?.pages.flatMap(
        (page: UseInfiniteQueryResult<WebsiteType[]>) => page.data,
      ),
  });

  return query;
};
