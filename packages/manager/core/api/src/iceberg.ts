import { AxiosResponse } from 'axios';

import { apiClient } from './client.js';
import { transformTagsFiltersToQuery } from './filters.js';
import {
  Filter,
  FilterComparator,
  FilterTypeCategories,
} from './types/filters.type.js';
import {
  IcebergFetchParamsV2,
  IcebergFetchParamsV6,
  IcebergFetchResultV2,
  IcebergFetchResultV6,
} from './types/iceberg.type.js';

export const appendIamTags = (
  params: URLSearchParams,
  filters: Filter[] | undefined,
  paramName = 'iamTags',
) => {
  if (filters?.length) {
    const tagsFilterParams = transformTagsFiltersToQuery(filters);
    if (tagsFilterParams) {
      params.append(paramName, tagsFilterParams);
    }
  }
  return params;
};

export function icebergFilter(
  comparator: FilterComparator,
  value: string | string[],
) {
  const v = encodeURIComponent(String(value || ''));
  switch (comparator) {
    case FilterComparator.Includes:
      return `like=%25${v}%25`;
    case FilterComparator.StartsWith:
      return `like=${v}%25`;
    case FilterComparator.EndsWith:
      return `like=%25${v}`;
    case FilterComparator.IsEqual:
      return `eq=${v}`;
    case FilterComparator.IsDifferent:
      return `ne=${v}`;
    case FilterComparator.IsLower:
      return `lt=${v}`;
    case FilterComparator.IsHigher:
      return `gt=${v}`;
    case FilterComparator.IsBefore:
      return `lt=${v}`;
    case FilterComparator.IsAfter:
      return `gt=${v}`;
    case FilterComparator.IsIn: {
      const valueArray = value as string[];
      if (valueArray.length === 1) {
        return `eq=${valueArray[0]}`;
      }
      return `in=${valueArray.map(encodeURIComponent).join(',')}`;
    }
    default:
      throw new Error(`Missing comparator implementation: '${comparator}'`);
  }
}

export const buildHeaders = () => {
  const headers: Record<string, string> = {};

  const builder = {
    setPaginationMode: (mode = 'CachedObjectList-Pages', isEnabled = true) => {
      if (isEnabled) {
        headers['x-pagination-mode'] = mode;
      }
      return builder;
    },
    setPaginationNumber: (page = 1) => {
      headers['x-pagination-number'] = `${encodeURIComponent(page || 1)}`;
      return builder;
    },
    setPaginationSize: (pageSize = 5000) => {
      headers['X-Pagination-Size'] = `${encodeURIComponent(pageSize || 5000)}`;
      return builder;
    },
    setPaginationCursor: (cursor: string | undefined) => {
      if (cursor) headers['X-Pagination-Cursor'] = cursor;
      return builder;
    },
    setDisabledCache: (disableCache: boolean | undefined) => {
      if (disableCache) headers.Pragma = 'no-cache';
      return builder;
    },
    setPaginationSort: (sortBy: string | undefined, sortOrder = 'ASC') => {
      if (sortBy) {
        headers['x-pagination-sort'] = encodeURIComponent(sortBy);
        headers['x-pagination-sort-order'] = sortOrder;
      }
      return builder;
    },
    setPaginationFilter: (filters: Filter[] | undefined) => {
      if (filters?.length) {
        const filtersJoin = filters
          .filter(({ type }) => type !== FilterTypeCategories.Tags)
          .map(({ comparator, key, value }) => {
            const correctedValue =
              typeof value === 'object' ? value : String(value || '');
            return `${encodeURIComponent(key)}:${icebergFilter(
              comparator,
              correctedValue,
            )}`;
          })
          .join('&');
        if (filtersJoin) {
          headers['x-pagination-filter'] = filtersJoin;
        }
      }
      return builder;
    },
    setCustomHeader: (key: string, value: string) => {
      headers[key] = value;
      return builder;
    },
    setIamTags: (
      params: URLSearchParams,
      filters: Filter[] | undefined,
      paramName = 'iamTags',
    ) => {
      appendIamTags(params, filters, paramName);
      return builder;
    },
    build: () => headers,
  };

  return builder;
};

export const getRouteWithParams = (route: string, params: URLSearchParams) => {
  if (params.size)
    return route.indexOf('?') > -1
      ? `${route}&${params.toString()}`
      : `${route}?${params.toString()}`;
  return route;
};

export async function fetchIcebergV2<T>({
  route,
  pageSize,
  cursor,
  filters,
  sortBy,
  sortOrder,
  disableCache,
  icebergCacheMode,
  enableIcebergCache,
}: IcebergFetchParamsV2): Promise<IcebergFetchResultV2<T>> {
  const params = new URLSearchParams();
  const requestHeaders = buildHeaders()
    .setPaginationMode(icebergCacheMode, enableIcebergCache)
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

  const response: AxiosResponse<T[]> = await apiClient.v2.get<T[]>(
    getRouteWithParams(route, params),
    { headers: requestHeaders },
  );

  const headers = response.headers as Record<string, string | undefined>;

  return {
    data: response.data,
    cursorNext: headers['x-pagination-cursor-next'],
    status: response.status,
  };
}

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

  const response: AxiosResponse<T[]> = await apiClient.v6.get<T[]>(
    getRouteWithParams(route, params),
    { headers: requestHeaders },
  );

  const totalCount = Number(response.headers['x-pagination-elements']) || 0;

  return {
    data: response.data,
    totalCount,
    status: response.status,
  };
}
