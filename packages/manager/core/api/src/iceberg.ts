import { AxiosResponse } from 'axios';

import { v2, v6 } from './client.js';
import {
  IcebergFetchParams,
  IcebergFetchParamsV2,
  IcebergFetchParamsV6,
  IcebergFetchResult,
  IcebergFetchResultV2,
  IcebergFetchResultV6,
} from './types/iceberg.type.js';
import { buildHeaders } from './utils/headers-builder/headersBuilder.js';

export const getRouteWithParams = (route: string, params: URLSearchParams) => {
  if (params.size)
    return route.indexOf('?') > -1
      ? `${route}&${params.toString()}`
      : `${route}?${params.toString()}`;
  return route;
};

export const fetchWithIceberg = async <TData = unknown>({
  version = 'v6',
  route,
  page,
  pageSize,
  filters,
  sortBy,
  sortOrder,
  disableCache,
}: IcebergFetchParams): Promise<IcebergFetchResult<TData>> => {
  const params = new URLSearchParams();
  const requestHeaders = buildHeaders()
    .setPaginationMode()
    .setPaginationSize(pageSize)
    .setPaginationNumber(page)
    .setDisabledCache(disableCache)
    .setPaginationSort(sortBy, sortOrder)
    .setPaginationFilter(filters)
    .setIamTags(params, filters)
    .build();

  const apiEngine = version === 'v2' ? v2 : v6;

  const { data, headers, status }: AxiosResponse<TData> = await apiEngine.get(
    getRouteWithParams(route, params),
    {
      headers: requestHeaders,
    },
  );
  const totalCount = parseInt(headers['x-pagination-elements'] as string, 10);

  return {
    data,
    totalCount,
    status,
  };
};

// @deprecated Use fetchWithIceberg
export async function fetchIcebergV2<T>({
  route,
  pageSize,
  cursor,
  filters,
  sortBy,
  sortOrder,
  disableCache,
}: IcebergFetchParamsV2): Promise<IcebergFetchResultV2<T>> {
  const params = new URLSearchParams();
  const requestHeaders = buildHeaders()
    .setPaginationSize(pageSize)
    .setPaginationCursor(cursor)
    .setDisabledCache(disableCache)
    .setPaginationSort(sortBy, sortOrder)
    .setPaginationFilter(filters)
    .setIamTags(
      params,
      filters,
      route.includes('/iam/resource') ? 'tags' : 'iamTags',
    )
    .build();

  const response: AxiosResponse<T[]> = await v2.get<T[]>(
    getRouteWithParams(route, params),
    {
      headers: requestHeaders,
    },
  );

  const headers = response.headers as Record<string, string | undefined>;

  return {
    data: response.data,
    cursorNext: headers['x-pagination-cursor-next'],
    status: response.status,
  };
}

// @deprecated Use fetchWithIceberg or fetchV2 depending on your need
export async function fetchIcebergV6<T>({
  route,
  page,
  pageSize,
  filters,
  sortBy,
  sortReverse,
  disableCache,
}: IcebergFetchParamsV6): Promise<IcebergFetchResultV6<T>> {
  const params = new URLSearchParams();
  const requestHeaders = buildHeaders()
    .setPaginationMode()
    .setPaginationSize(pageSize)
    .setPaginationNumber(page)
    .setDisabledCache(disableCache)
    .setPaginationSort(sortBy, sortReverse ? 'DESC' : 'ASC')
    .setPaginationFilter(filters)
    .setIamTags(params, filters)
    .build();

  const response: AxiosResponse<T[]> = await v6.get<T[]>(
    getRouteWithParams(route, params),
    {
      headers: requestHeaders,
    },
  );

  const totalCount = Number(response.headers['x-pagination-elements']) || 0;

  return {
    data: response.data,
    totalCount,
    status: response.status,
  };
}
