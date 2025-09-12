import { transformTagsFiltersToQuery } from '../../filters.js';
import {
  FilterTypeCategories,
  Filter,
  FilterComparator,
} from '../../types/filters.type.js';

export function getIcebergFilter(
  comparator: FilterComparator,
  value: string | string[],
) {
  const encodedValue = encodeURIComponent(String(value || ''));
  switch (comparator) {
    case FilterComparator.Includes:
      return `like=%25${encodedValue}%25`;
    case FilterComparator.StartsWith:
      return `like=${encodedValue}%25`;
    case FilterComparator.EndsWith:
      return `like=%25${encodedValue}`;
    case FilterComparator.IsEqual:
      return `eq=${encodedValue}`;
    case FilterComparator.IsDifferent:
      return `ne=${encodedValue}`;
    case FilterComparator.IsLower:
      return `lt=${encodedValue}`;
    case FilterComparator.IsHigher:
      return `gt=${encodedValue}`;
    case FilterComparator.IsBefore:
      return `lt=${encodedValue}`;
    case FilterComparator.IsAfter:
      return `gt=${encodedValue}`;
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

export const buildHeaders = () => {
  const headers: Record<string, string> = {};

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
            return `${encodeURIComponent(key)}:${getIcebergFilter(
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
    setCursor: (cursor: string | undefined) => {
      if (cursor) {
        headers['x-pagination-cursor'] = cursor;
      }
      return builder;
    },
    build: () => headers,
  };

  return builder;
};
