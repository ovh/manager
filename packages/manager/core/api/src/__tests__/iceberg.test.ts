import { describe, it, expect } from 'vitest';

import { FilterComparator, FilterTypeCategories, Filter } from '../filters';
import { buildHeaders, appendIamTags } from '../iceberg';

describe('buildHeaders', () => {
  it('should build headers', () => {
    const params = {
      pageSize: 10,
      cursor: '1',
      disableCache: true,
      sortBy: 'name',
      sortOrder: 'ASC',
      filters: [] as Filter[],
    };
    const requestHeaders = buildHeaders()
      .setPaginationSize(params.pageSize)
      .setPaginationCursor(params.cursor)
      .setDisabledCache(params.disableCache)
      .setPaginationSort(params.sortBy, params.sortOrder)
      .setPaginationFilter(params.filters)
      .build();
    console.log('requestHeaders', requestHeaders);
    expect(requestHeaders['X-Pagination-Size']).toEqual('10');
    expect(requestHeaders['X-Pagination-Cursor']).toEqual('1');
    expect(requestHeaders.Pragma).toEqual('no-cache');
    expect(requestHeaders['x-pagination-sort']).toEqual('name');
    expect(requestHeaders['x-pagination-sort-order']).toEqual('ASC');
  });

  it('should fill x-pagination-mode', () => {
    const params = {
      pageSize: 10,
      cursor: '1',
      disableCache: true,
    };
    const requestHeaders = buildHeaders()
      .setPaginationMode()
      .setPaginationSize(params.pageSize)
      .setPaginationCursor(params.cursor)
      .setDisabledCache(params.disableCache)
      .build();
    expect(requestHeaders['x-pagination-mode']).toEqual(
      'CachedObjectList-Pages',
    );
  });
});

it('should fill IAM tags', () => {
  let params = new URLSearchParams();
  const filters = [
    {
      key: 'name',
      value: 'test',
      comparator: FilterComparator.IsEqual,
      type: FilterTypeCategories.String,
    },
    {
      key: 'displayName',
      value: 'test',
      comparator: FilterComparator.IsEqual,
      type: FilterTypeCategories.String,
    },
  ];
  params = appendIamTags(params, filters);
  console.info('params', params.toString());
  // iamTags=name:test,displayName:test
  //   expect(params).toEqual('iamTags=name:test,displayName:test');
});

// requestHeaders {
//     'X-Pagination-Size': '10',
//     'X-Pagination-Cursor': '1',
//     Pragma: 'no-cache',
//     'x-pagination-sort': 'name',
//     'x-pagination-sort-order': 'ASC'
//   }
