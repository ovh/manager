import React, { useMemo } from 'react';

import type { SortingState } from '@tanstack/react-table';

import { useDataApi } from '@ovh-ux/muk';

import { APP_FEATURES } from '@/App.constants';
import { ResourcesFacadeResult, UseResourcesParams } from '@/types/ClientApi.type';
import { ListingDataResultType } from '@/types/Listing.type';

function mapResponse<T>(response: {
  data?: T[];
  flattenData?: T[];
  totalCount?: number;
  hasNextPage?: boolean;
  fetchNextPage?: () => Promise<unknown> | void;
  isLoading?: boolean;
  status?: string;
  sorting?:
    | {
        sorting: SortingState;
        setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
        manualSorting: boolean;
      }
    | undefined;
  filters?: unknown;
  search?: unknown;
}): ResourcesFacadeResult<T> {
  const status = response.status as 'pending' | 'success' | 'error' | undefined;
  return {
    flattenData: response.flattenData ?? response.data,
    totalCount: response.totalCount,
    hasNextPage: response.hasNextPage,
    fetchNextPage: response.fetchNextPage,
    isLoading: response.isLoading,
    status,
    sorting: response.sorting?.sorting?.[0],
    setSorting: response.sorting?.setSorting,
    filters: response.filters,
    search: response.search,
  };
}

function createResourcesFactory<T extends Record<string, unknown>>() {
  return {
    v6Iceberg: (params: UseResourcesParams<T>): ResourcesFacadeResult<T> => {
      const response = useDataApi<T>({
        route: params.route,
        version: 'v6',
        iceberg: true,
        cacheKey: (params.queryKey ?? ['resources', params.route]) as string | string[],
        pageSize: params.pageSize,
        columns: params.columns as any,
        defaultSorting: params.defaultSorting,
        enabled: params.enabled,
        disableCache: params.disableCache,
        fetchAll: params.fetchAll,
      });
      return mapResponse<T>(response);
    },
    v2: (params: UseResourcesParams<T>): ResourcesFacadeResult<T> => {
      const response = useDataApi<T>({
        route: params.route,
        version: 'v2',
        cacheKey: (params.queryKey ?? ['resources', params.route]) as string | string[],
        pageSize: params.pageSize,
        enabled: params.enabled,
        fetchAll: params.fetchAll,
      });
      return mapResponse<T>(response);
    },
    v6: (params: UseResourcesParams<T>): ResourcesFacadeResult<T> => {
      const response = useDataApi<T>({
        route: params.route,
        version: 'v6',
        cacheKey: (params.queryKey ?? ['resources', params.route]) as string | string[],
        pageSize: params.pageSize,
        columns: (params.columns ?? []) as any,
        defaultSorting: params.defaultSorting,
        enabled: params.enabled,
        refetchInterval: params.refetchInterval,
        fetchDataFn: params.fetchDataFn
          ? (_route: string) => params.fetchDataFn().then((data) => ({ data }))
          : undefined,
      });
      return mapResponse<T>(response);
    },
  };
}

export function useResources<T extends Record<string, unknown> = Record<string, unknown>>(
  params: UseResourcesParams<T>,
): ResourcesFacadeResult<T> {
  const resourcesFactory = createResourcesFactory<T>();
  const api = APP_FEATURES.listingApi;

  if (api === 'v6Iceberg') return resourcesFactory.v6Iceberg(params);
  if (api === 'v2') return resourcesFactory.v2(params);
  return resourcesFactory.v6(params);
}

export function useListingData<T extends Record<string, unknown> = Record<string, unknown>>(
  route: string,
): ListingDataResultType<T> {
  const raw = useResources<T>({
    route,
    queryKey: ['listing', route],
  });

  return useMemo<ListingDataResultType<T>>(() => {
    const items = raw?.flattenData ?? [];
    const total = typeof raw?.totalCount === 'number' ? raw.totalCount : items.length;

    const fetchNextPage =
      raw?.hasNextPage && raw?.fetchNextPage
        ? () => {
            raw.fetchNextPage?.();
          }
        : undefined;

    return {
      items,
      total,
      isLoading: !!raw?.isLoading,
      hasNextPage: !!raw?.hasNextPage,
      fetchNextPage,
    };
  }, [raw]);
}
