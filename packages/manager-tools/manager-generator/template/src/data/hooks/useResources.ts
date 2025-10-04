import React, { useMemo } from 'react';

import {
  ColumnSort,
  useResourcesIcebergV2,
  useResourcesIcebergV6,
  useResourcesV6,
} from '@ovh-ux/muk';

import { APP_FEATURES } from '@/App.constants';
import {
  ResourcesFacadeResult,
  UseResourcesParams,
} from '@/types/ClientApi.type';
import { ListingDataResultType } from '@/types/Listing.type';

function mapResponseWithTotal<T>(response: {
  flattenData?: T[];
  totalCount?: number;
  hasNextPage?: boolean;
  fetchNextPage?: () => Promise<unknown> | void;
  isLoading?: boolean;
  status?: 'pending' | 'success' | 'error';
  sorting?: ColumnSort | undefined;
  setSorting?: React.Dispatch<React.SetStateAction<ColumnSort>>;
  filters?: unknown;
  search?: unknown;
}): ResourcesFacadeResult<T> {
  return {
    flattenData: response.flattenData,
    totalCount: response.totalCount,
    hasNextPage: response.hasNextPage,
    fetchNextPage: response.fetchNextPage,
    isLoading: response.isLoading,
    status: response.status,
    sorting: response.sorting,
    setSorting: response.setSorting,
    filters: response.filters,
    search: response.search,
  };
}

function mapResponseWithoutTotal<T>(response: {
  flattenData?: T[];
  hasNextPage?: boolean;
  fetchNextPage?: () => Promise<unknown> | void;
  isLoading?: boolean;
  status?: 'pending' | 'success' | 'error';
  sorting?: ColumnSort | undefined;
  setSorting?: React.Dispatch<React.SetStateAction<ColumnSort>>;
  filters?: unknown;
  search?: unknown;
}): ResourcesFacadeResult<T> {
  return {
    flattenData: response.flattenData,
    hasNextPage: response.hasNextPage,
    fetchNextPage: response.fetchNextPage,
    isLoading: response.isLoading,
    status: response.status,
    sorting: response.sorting,
    setSorting: response.setSorting,
    filters: response.filters,
    search: response.search,
  };
}

/* eslint-disable react-hooks/rules-of-hooks */
function createResourcesFactory<T extends Record<string, unknown>>() {
  return {
    v6Iceberg: (params: UseResourcesParams<T>): ResourcesFacadeResult<T> => {
      const response = useResourcesIcebergV6<T>(params);
      return mapResponseWithTotal<T>(response);
    },
    v2: (params: UseResourcesParams<T>): ResourcesFacadeResult<T> => {
      const response = useResourcesIcebergV2<T>(params);
      return mapResponseWithoutTotal<T>(response);
    },
    v6: (params: UseResourcesParams<T>): ResourcesFacadeResult<T> => {
      const response = useResourcesV6<T>({
        ...params,
        columns: params.columns ?? [],
      });
      return mapResponseWithTotal<T>(response);
    },
  };
}

export function useResources<
  T extends Record<string, unknown> = Record<string, unknown>
>(params: UseResourcesParams<T>): ResourcesFacadeResult<T> {
  const resourcesFactory = createResourcesFactory<T>();
  const api = APP_FEATURES.listingApi;

  if (api === 'v6Iceberg') return resourcesFactory.v6Iceberg(params);
  if (api === 'v2') return resourcesFactory.v2(params);
  return resourcesFactory.v6(params);
}

export function useListingData<
  T extends Record<string, unknown> = Record<string, unknown>
>(route: string): ListingDataResultType<T> {
  const raw = useResources<T>({
    route,
    queryKey: ['listing', route],
  });

  return useMemo<ListingDataResultType<T>>(() => {
    const items = raw?.flattenData ?? [];
    const total =
      typeof raw?.totalCount === 'number' ? raw.totalCount : items.length;

    const fetchNextPage =
      raw?.hasNextPage && raw?.fetchNextPage
        ? () => {
            void raw.fetchNextPage?.();
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
