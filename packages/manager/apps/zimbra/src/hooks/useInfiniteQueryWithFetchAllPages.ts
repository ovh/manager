import {
  QueryFunctionContext,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { buildURLSearchParams } from '@/utils';

type AdditionalQueryContext = {
  allPages: boolean;
  urlSearchParams?: string;
};

export type UseInfiniteQueryWithFetchAllPagesOptions<T = unknown> = Omit<
  UseInfiniteQueryOptions<T>,
  'queryFn'
> & {
  shouldFetchAll?: boolean;
  queryFn: (
    context: AdditionalQueryContext & QueryFunctionContext,
  ) => T | Promise<T>;
  searchParams?: Record<string, string>;
};

export function useInfiniteQueryWithFetchAllPages<T = unknown>(
  props: UseInfiniteQueryWithFetchAllPagesOptions<T>,
) {
  const { shouldFetchAll, searchParams, ...options } = props;
  const [allPages, setAllPages] = useState(!!shouldFetchAll);
  const urlSearchParams = buildURLSearchParams(searchParams || {});

  const query = useInfiniteQuery({
    ...options,
    queryKey: [
      ...props.queryKey,
      urlSearchParams,
      allPages ? 'all' : '',
    ].filter(Boolean),
    queryFn: (context) =>
      props.queryFn(Object.assign(context, { allPages, urlSearchParams })),
  });

  const fetchAllPages = useCallback(() => {
    if (!allPages) {
      setAllPages(true);
    }
  }, [allPages, setAllPages]);

  // reset when searchParams changes
  useEffect(() => {
    if (!shouldFetchAll) {
      setAllPages(false);
    }
  }, [urlSearchParams]);

  // fetch all pages sequentially if needed
  useEffect(() => {
    if (allPages && query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [query.data, allPages]);

  // use object assign instead of spread
  // to avoid unecessary rerenders
  return Object.assign(query, {
    fetchAllPages,
  });
}
