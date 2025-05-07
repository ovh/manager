import {
  Filter,
  FilterComparator,
  FilterTypeCategories,
  transformTagsFiltersToQuery,
} from './filters';
import apiClient from './client';

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

export type IcebergFetchParamsV2 = { cursor?: string } & IcebergCommonOptions;

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

function icebergFilter(comparator: FilterComparator, value: string | string[]) {
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

export async function fetchIcebergV2<T>({
  route,
  pageSize,
  cursor,
  disableCache,
}: IcebergFetchParamsV2): Promise<IcebergFetchResultV2<T>> {
  const requestHeaders: Record<string, string> = {
    'X-Pagination-Size': `${encodeURIComponent(pageSize || 5000)}`,
    ...(cursor ? { 'X-Pagination-Cursor': `${cursor}` } : {}),
    ...(disableCache ? { Pragma: 'no-cache' } : {}),
  };

  const { data, headers, status } = await apiClient.v2.get(route, {
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
  const requestHeaders: Record<string, string> = {
    'x-pagination-mode': 'CachedObjectList-Pages',
    'x-pagination-number': `${encodeURIComponent(page || 1)}`,
    'x-pagination-size': `${encodeURIComponent(pageSize || 5000)}`,
  };

  const params = new URLSearchParams();

  if (sortBy) {
    requestHeaders['x-pagination-sort'] = encodeURIComponent(sortBy);
    requestHeaders['x-pagination-sort-order'] = sortReverse ? 'DESC' : 'ASC';
  }
  if (filters?.length) {
    requestHeaders['x-pagination-filter'] = filters
      .filter(({ type }) => type !== FilterTypeCategories.Tags)
      .map(
        ({ comparator, key, value }) =>
          `${encodeURIComponent(key)}:${icebergFilter(comparator, value)}`,
      )
      .join('&');

    const tagsFilterParams = transformTagsFiltersToQuery(filters);
    if (tagsFilterParams) {
      params.append('iamTags', tagsFilterParams);
    }
  }

  if (requestHeaders['x-pagination-filter'] === '') {
    delete requestHeaders['x-pagination-filter'];
  }

  if (disableCache) {
    requestHeaders.Pragma = 'no-cache';
  }

  let routeWithParams = route;
  if (params.size) {
    routeWithParams =
      route.indexOf('?') > -1
        ? `${route}&${params.toString()}`
        : `${route}?${params.toString()}`;
  }

  const { data, headers, status } = await apiClient.v6.get(routeWithParams, {
    headers: requestHeaders,
  });
  const totalCount = parseInt(headers['x-pagination-elements'], 10) || 0;

  return { data, totalCount, status };
}
