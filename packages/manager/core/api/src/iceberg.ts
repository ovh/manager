import apiClient from './client';
import {
  Filter,
  FilterComparator,
  FilterTypeCategories,
  transformTagsFiltersToQuery,
} from './filters';

export type IcebergCommonOptions = {
  route: string;
  pageSize?: number;
  disableCache?: boolean;
  search?: {
    key: string;
    value: string;
  };
};

export type IcebergFetchParamsV6 = {
  page?: number;
  filters?: Filter[];
  sortBy?: string;
  sortReverse?: boolean;
} & IcebergCommonOptions;

export type IcebergFetchParamsV2 = {
  cursor?: string;
  filters?: Filter[];
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
} & IcebergCommonOptions;

export type IcebergFetchResultV6<T> = {
  data: T[];
  totalCount: number;
  status: number;
};

export type IcebergFetchResultV2<T> = {
  data: T[];
  cursorNext: string;
  status: number;
};

export const appendIamTags = (
  params: URLSearchParams,
  filters: Filter[],
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

export function icebergFilter(comparator: FilterComparator, value: string | string[]) {
  const v = encodeURIComponent(`${value}`);
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
  const headers = {};

  const builder = {
    setPaginationMode: (mode = 'CachedObjectList-Pages') => {
      headers['x-pagination-mode'] = mode;
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
    setPaginationCursor: (cursor: string) => {
      if (cursor) headers['X-Pagination-Cursor'] = cursor;
      return builder;
    },
    setDisabledCache: (disableCache: boolean | undefined) => {
      if (disableCache) headers['Pragma'] = 'no-cache';
      return builder;
    },
    setPaginationSort: (sortBy: string, sortOrder = 'ASC') => {
      if (sortBy) {
        headers['x-pagination-sort'] = encodeURIComponent(sortBy);
        headers['x-pagination-sort-order'] = sortOrder;
      }
      return builder;
    },
    setPaginationFilter: (filters: Filter[]) => {
      if (filters?.length) {
        const filtersJoin = filters
          .filter(({ type }) => type !== FilterTypeCategories.Tags)
          .map(
            ({ comparator, key, value }) =>
              `${encodeURIComponent(key)}:${icebergFilter(comparator, value)}`,
          )
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
    setIamTags: (params: URLSearchParams, filters: Filter[], paramName = 'iamTags') => {
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
}: IcebergFetchParamsV2): Promise<IcebergFetchResultV2<T>> {
  const params = new URLSearchParams();
  const requestHeaders = buildHeaders()
    .setPaginationSize(pageSize)
    .setPaginationCursor(cursor)
    .setDisabledCache(disableCache)
    .setPaginationSort(sortBy, sortOrder)
    .setPaginationFilter(filters)
    .setIamTags(params, filters, route.includes('/iam/resource') ? 'tags' : 'iamTags')
    .build();

  const { data, headers, status } = await apiClient.v2.get(getRouteWithParams(route, params), {
    headers: requestHeaders,
  });

  return { data, cursorNext: headers['x-pagination-cursor-next'], status };
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

  const { data, headers, status } = await apiClient.v6.get(getRouteWithParams(route, params), {
    headers: requestHeaders,
  });
  const totalCount = parseInt(headers['x-pagination-elements'], 10) || 0;

  return { data, totalCount, status };
}
