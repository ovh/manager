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

const buildHeaders = () => {
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
    setDisabledCache: (disableCache: boolean) => {
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
        headers['x-pagination-filter'] = filters
          .filter(({ type }) => type !== FilterTypeCategories.Tags)
          .map(
            ({ comparator, key, value }) =>
              `${encodeURIComponent(key)}:${icebergFilter(comparator, value)}`,
          )
          .join('&');
      }
      return builder;
    },
    setCustomHeader: (key: string, value: string) => {
      headers[key] = value;
      return builder;
    },
    build: () => headers,
  };

  return builder;
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
  const requestHeaders = buildHeaders()
    .setPaginationSize(pageSize)
    .setPaginationCursor(cursor)
    .setDisabledCache(disableCache)
    .setPaginationSort(sortBy, sortOrder)
    .setPaginationFilter(filters)
    .build();

  const params = new URLSearchParams();

  if (filters?.length) {
    const tagsFilterParams = transformTagsFiltersToQuery(filters);
    if (tagsFilterParams) {
      params.append('iamTags', tagsFilterParams);
    }
  }

  let routeWithParams = route;
  if (params.size) {
    routeWithParams =
      route.indexOf('?') > -1
        ? `${route}&${params.toString()}`
        : `${route}?${params.toString()}`;
  }

  const { data, headers, status } = await apiClient.v2.get(routeWithParams, {
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
  const requestHeaders = buildHeaders()
    .setPaginationMode()
    .setPaginationSize(pageSize)
    .setPaginationNumber(page)
    .setDisabledCache(disableCache)
    .setPaginationSort(sortBy, sortReverse ? 'DESC' : 'ASC')
    .setPaginationFilter(filters)
    .build();

  const params = new URLSearchParams();

  if (filters?.length) {
    const tagsFilterParams = transformTagsFiltersToQuery(filters);
    if (tagsFilterParams) {
      params.append('iamTags', tagsFilterParams);
    }
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
