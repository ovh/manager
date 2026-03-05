import { useEffect } from 'react';

import { fetchV2 } from '@ovh-ux/manager-core-api';
import type { FetchV2Result } from '@ovh-ux/manager-core-api';

import type { DatagridColumn } from '@/components/datagrid/Datagrid.props';
import { DEFAULT_DATA_API_RESPONSE } from '@/hooks/data-api/ports/useDataApi.constants';
import { UseDataApiResult } from '@/hooks/data-api/ports/useDataApi.types';

import { UseInifiniteQueryResult, useInfiniteQuery } from '../../infra/tanstack';
import { useDataRetrievalOperations } from '../../useDataRetrievalOperations';
import type { UseV2Data, UseV2Params } from './useV2.types';
import { useV2UrlParams } from './useV2UrlParams';

export const useV2 = <TData = Record<string, unknown>>({
  route = '',
  pageSize = 10,
  fetchAll = false,
  cacheKey,
  enabled,
  urlParams,
  columns = [] as DatagridColumn<TData>[],
}: UseV2Params<TData>): UseDataApiResult<TData> => {
  const defaultSorting = undefined;
  const retrievalOps = useDataRetrievalOperations<TData>({ defaultSorting, columns });

  const { filters, addFilter, removeFilter, setSearchInput, searchInput } = retrievalOps;

  const { data, hasNextPage, fetchNextPage, ...rest }: UseInifiniteQueryResult<UseV2Data<TData>> =
    useInfiniteQuery<FetchV2Result<TData>, Error, UseV2Data<TData>, string[], string>({
      initialPageParam: '',
      cacheKey: [...cacheKey, fetchAll ? 'all' : String(pageSize)],
      enabled: enabled ?? true,
      fetchDataFn: ({ pageParam: cursor }): Promise<FetchV2Result<TData>> =>
        fetchV2<TData>({
          route,
          pageSize,
          ...(!!cursor && typeof cursor === 'string' && { cursor }),
        }),
      getNextPageParam: (lastPage: FetchV2Result<TData>): string | null => {
        if (lastPage.nextCursor) {
          return lastPage.nextCursor;
        }
        return null;
      },
      transformFn: (pages): UseV2Data<TData> => {
        const { totalCount } = pages[0] as FetchV2Result;
        return {
          flattenData: pages.flatMap((page) => page.data),
          totalCount,
        };
      },
    });

  useEffect(() => {
    if (fetchAll && hasNextPage && enabled) {
      void fetchNextPage();
    }
  }, [data, fetchAll, hasNextPage, fetchNextPage, enabled]);

  const { addFilterAndParamsInUrl, removeFilterByCoreFilter, onSearch } = useV2UrlParams<TData>({
    urlParams,
    columns,
    filters,
    addFilter,
    removeFilter,
    setSearchInput,
    searchInput,
  });

  if (!enabled) {
    return DEFAULT_DATA_API_RESPONSE;
  }

  return {
    ...(data && { ...data }),
    hasNextPage,
    fetchNextPage,
    search: {
      onSearch: onSearch,
      searchInput,
      setSearchInput: setSearchInput,
      searchParams: urlParams?.searchParams ?? '',
    },
    filters: {
      filters,
      add: addFilterAndParamsInUrl,
      remove: removeFilterByCoreFilter,
    },
    ...rest,
  };
};
