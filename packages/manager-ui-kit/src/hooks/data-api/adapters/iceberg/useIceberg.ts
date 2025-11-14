import React, { useEffect } from 'react';

import type { SortingState } from '@tanstack/react-table';

import { fetchWithIceberg } from '@ovh-ux/manager-core-api';
import type { IcebergFetchResult } from '@ovh-ux/manager-core-api';

import {
  DEFAULT_DATA_API_RESPONSE,
  DEFAULT_PAGE_SIZE,
} from '@/hooks/data-api/ports/useDataApi.constants';
import { UseDataApiResult } from '@/hooks/data-api/ports/useDataApi.types';
import { useDataRetrievalOperations } from '@/hooks/data-api/useDataRetrievalOperations';

import { UseInifiniteQueryResult, useInfiniteQuery } from '../../infra/tanstack';
import { API_V6_MAX_PAGE_SIZE } from './useIceberg.constants';
import { UseIcebergData, UseIcebergParams } from './useIceberg.type';

export const useIceberg = <TData = Record<string, unknown>>({
  version = 'v6',
  route = '',
  pageSize = DEFAULT_PAGE_SIZE,
  cacheKey,
  defaultSorting = undefined,
  fetchAll = false,
  columns = [],
  disableCache,
  enabled = true,
}: UseIcebergParams<TData>): UseDataApiResult<TData> => {
  const retrievalOps = useDataRetrievalOperations<TData>({ defaultSorting, columns });

  const {
    searchInput,
    setSearchInput,
    searchFilters,
    sorting,
    setSorting,
    filters,
    addFilter,
    removeFilter,
    onSearch,
  } = retrievalOps;

  const {
    data: dataSelected,
    hasNextPage,
    fetchNextPage,
    ...rest
  }: UseInifiniteQueryResult<UseIcebergData<TData>> = useInfiniteQuery<
    IcebergFetchResult<TData>,
    Error,
    UseIcebergData<TData>,
    string[],
    number
  >({
    initialPageParam: 1,
    cacheKey: [
      ...(typeof cacheKey === 'string' ? [cacheKey] : (cacheKey ?? [])),
      fetchAll ? 'all' : String(pageSize),
      JSON.stringify(sorting ?? []),
      JSON.stringify(filters ?? []),
      JSON.stringify(searchFilters ?? []),
    ],
    enabled,
    fetchDataFn: ({ pageParam: pageIndex }): Promise<IcebergFetchResult<TData>> =>
      fetchWithIceberg<TData>({
        version,
        route,
        pageSize: fetchAll ? API_V6_MAX_PAGE_SIZE : pageSize,
        ...(typeof pageIndex === 'number' && { page: pageIndex }),
        sortBy: sorting?.[0]?.id,
        sortOrder: sorting?.[0]?.desc ? 'DESC' : 'ASC',
        filters: searchFilters ? [...searchFilters, ...filters] : filters,
        disableCache,
      }),
    getNextPageParam: (
      lastPage: IcebergFetchResult<TData>,
      lastPageIndex: number,
    ): number | null => {
      if (lastPage.totalCount / pageSize > lastPageIndex) {
        return lastPageIndex + 1;
      }
      return null;
    },
    transformFn: (pages, pageParams): UseIcebergData<TData> => {
      const pageIndex = pageParams[pageParams.length - 1] ?? 1;
      const totalCount = pages[0]?.totalCount ?? 0;

      return {
        pageIndex,
        totalCount,
        flattenData: pages.flatMap((page) => page.data),
      };
    },
  });

  useEffect(() => {
    if (fetchAll && hasNextPage && enabled) {
      void fetchNextPage();
    }
  }, [dataSelected, fetchAll, hasNextPage, fetchNextPage, enabled]);

  if (!enabled) {
    return {
      ...DEFAULT_DATA_API_RESPONSE,
      sorting: {
        sorting: [],
        setSorting: () => {},
        manualSorting: false,
      },
    };
  }

  return {
    ...(dataSelected && { ...dataSelected }),
    hasNextPage,
    fetchNextPage,
    sorting: {
      sorting: sorting ?? [],
      setSorting: ((value) =>
        setSorting(
          typeof value === 'function' ? (prev) => value(prev ?? []) : (value ?? []),
        )) as React.Dispatch<React.SetStateAction<SortingState>>,
      manualSorting: true,
    },
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
    ...rest,
  };
};
