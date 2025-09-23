import type { AxiosInstance } from 'axios';

import {
  type IcebergFetchResultV2,
  type IcebergFetchResultV6,
  fetchIcebergV2,
  fetchIcebergV6,
  v2 as httpV2,
  v6 as httpV6,
} from '@ovh-ux/manager-core-api';

import * as AppC from '@/App.constants';
import { ApiVersion, GetListingParams, JsonRequestOptions } from '@/types/ClientApi.type';
import { ListingPageResult } from '@/types/Listing.type';

const API_CLIENTS: Record<ApiVersion, AxiosInstance> = {
  v2: httpV2,
  v6: httpV6,
};

export function getApiClient(version: ApiVersion): AxiosInstance {
  return API_CLIENTS[version];
}

export async function getJSON<T>(
  version: ApiVersion,
  route: string,
  options: JsonRequestOptions = {},
): Promise<T> {
  const client = getApiClient(version);
  const headers = {
    ...(options.headers ?? {}),
    ...(options.disableCache ? { Pragma: 'no-cache' } : {}),
  };
  const { data } = await client.get<T>(route, { params: options.params, headers });
  return data;
}

export async function postJSON<T>(
  version: ApiVersion,
  route: string,
  body?: unknown,
  options: JsonRequestOptions = {},
): Promise<T> {
  const client = getApiClient(version);
  const headers = {
    ...(options.headers ?? {}),
    ...(options.disableCache ? { Pragma: 'no-cache' } : {}),
  };
  const { data } = await client.post<T>(route, body, { params: options.params, headers });
  return data;
}

export async function putJSON<T>(
  version: ApiVersion,
  route: string,
  body?: unknown,
  options: JsonRequestOptions = {},
): Promise<T> {
  const client = getApiClient(version);
  const headers = {
    ...(options.headers ?? {}),
    ...(options.disableCache ? { Pragma: 'no-cache' } : {}),
  };
  const { data } = await client.put<T>(route, body, { params: options.params, headers });
  return data;
}

export async function deleteJSON<T>(
  version: ApiVersion,
  route: string,
  options: JsonRequestOptions = {},
): Promise<T> {
  const client = getApiClient(version);
  const headers = {
    ...(options.headers ?? {}),
    ...(options.disableCache ? { Pragma: 'no-cache' } : {}),
  };
  const { data } = await client.delete<T>(route, { params: options.params, headers });
  return data;
}

async function fetchListingV6Iceberg<T>(
  route: string,
  { page = 1, pageSize = 20, sortBy, sortDesc, filters = [] }: GetListingParams,
): Promise<ListingPageResult<T>> {
  const res: IcebergFetchResultV6<T> = await fetchIcebergV6<T>({
    route,
    page,
    pageSize,
    sortBy,
    sortReverse: !!sortDesc,
    filters,
  });
  return {
    data: res.data,
    totalCount: res.totalCount,
    status: res.status,
  };
}

async function fetchListingV2Iceberg<T>(
  route: string,
  { pageSize = 20, sortBy, sortDesc, filters = [], cursor }: GetListingParams,
): Promise<ListingPageResult<T>> {
  const res: IcebergFetchResultV2<T> = await fetchIcebergV2<T>({
    route,
    pageSize,
    sortBy,
    sortOrder: sortDesc ? 'DESC' : 'ASC',
    filters,
    cursor,
  });
  return {
    data: res.data,
    totalCount: Number.POSITIVE_INFINITY,
    cursorNext: res.cursorNext,
    status: res.status,
  };
}

async function fetchListingPlainV6<T>(route: string): Promise<ListingPageResult<T>> {
  const data = await getJSON<T[]>('v6', route);
  return { data, totalCount: Array.isArray(data) ? data.length : 0, status: 200 };
}

export async function fetchListing<T = unknown>(
  route: string,
  params: GetListingParams = {},
): Promise<ListingPageResult<T>> {
  const apiChoice = AppC.APP_FEATURES?.listingApi;

  if (apiChoice === 'v6Iceberg') {
    return fetchListingV6Iceberg<T>(route, params);
  }
  if (apiChoice === 'v2') {
    return fetchListingV2Iceberg<T>(route, params);
  }
  return fetchListingPlainV6<T>(route);
}
