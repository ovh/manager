import { describe, it, expect } from 'vitest';
import { icebergFilter, buildHeaders, appendIamTags } from '../headersBuilder';
import {
  FilterComparator,
  FilterTypeCategories,
  Filter,
} from '../../../types/filters.type';

const createTestFilters = () => [
  {
    key: 'name',
    label: 'name',
    value: 'test',
    comparator: FilterComparator.IsEqual,
    type: FilterTypeCategories.String,
  },
  {
    key: 'displayName',
    label: 'displayName',
    value: 'test',
    comparator: FilterComparator.IsEqual,
    type: FilterTypeCategories.String,
  },
  {
    comparator: FilterComparator.IsEqual,
    key: 'tags',
    label: 'Tags',
    tagKey: 'environment',
    type: FilterTypeCategories.Tags,
    value: 'production',
  },
  {
    comparator: FilterComparator.IsDifferent,
    key: 'tags',
    label: 'Tags',
    tagKey: 'Department',
    type: FilterTypeCategories.Tags,
    value: 'Finance',
  },
];

const createHeaders = (
  options: {
    pageSize?: number;
    cursor?: string;
    disableCache?: boolean;
    sortBy?: string;
    sortOrder?: string;
    filters?: Filter[];
    customHeaders?: Record<string, string>;
  } = {},
) => {
  const builder = buildHeaders();

  if (options.pageSize !== undefined) {
    builder.setPaginationSize(options.pageSize);
  }
  if (options.cursor !== undefined) {
    builder.setPaginationCursor(options.cursor);
  }
  if (options.disableCache !== undefined) {
    builder.setDisabledCache(options.disableCache);
  }
  if (options.sortBy !== undefined) {
    builder.setPaginationSort(options.sortBy, options.sortOrder || 'ASC');
  }
  if (options.filters !== undefined) {
    builder.setPaginationFilter(options.filters);
  }
  if (options.customHeaders) {
    Object.entries(options.customHeaders).forEach(([key, value]) => {
      builder.setCustomHeader(key, value);
    });
  }

  return builder.build() as HeadersType;
};

type HeadersType = Record<string, string>;

describe('icebergFilter', () => {
  it('should build filter for IsEqual', () => {
    const filter = icebergFilter(FilterComparator.IsEqual, 'test');
    expect(filter).toEqual('eq=test');
  });

  it('should build filter for IsDifferent', () => {
    const filter = icebergFilter(FilterComparator.IsDifferent, 'test');
    expect(filter).toEqual('ne=test');
  });

  it('should build filter for Includes', () => {
    const filter = icebergFilter(FilterComparator.Includes, 'test');
    expect(filter).toEqual('like=%25test%25');
  });

  it('should build filter for StartsWith', () => {
    const filter = icebergFilter(FilterComparator.StartsWith, 'test');
    expect(filter).toEqual('like=test%25');
  });

  it('should build filter for EndsWith', () => {
    const filter = icebergFilter(FilterComparator.EndsWith, 'test');
    expect(filter).toEqual('like=%25test');
  });

  it('should build filter for IsLower', () => {
    const filter = icebergFilter(FilterComparator.IsLower, '100');
    expect(filter).toEqual('lt=100');
  });

  it('should build filter for IsHigher', () => {
    const filter = icebergFilter(FilterComparator.IsHigher, '100');
    expect(filter).toEqual('gt=100');
  });

  it('should build filter for IsBefore', () => {
    const filter = icebergFilter(FilterComparator.IsBefore, '2023-01-01');
    expect(filter).toEqual('lt=2023-01-01');
  });

  it('should build filter for IsAfter', () => {
    const filter = icebergFilter(FilterComparator.IsAfter, '2023-01-01');
    expect(filter).toEqual('gt=2023-01-01');
  });

  it('should build filter for IsIn with single value', () => {
    const filter = icebergFilter(FilterComparator.IsIn, ['test']);
    expect(filter).toEqual('eq=test');
  });

  it('should build filter for IsIn with multiple values', () => {
    const filter = icebergFilter(FilterComparator.IsIn, [
      'value1',
      'value2',
      'value3',
    ]);
    expect(filter).toEqual('in=value1,value2,value3');
  });

  it('should handle special characters in values', () => {
    const filter = icebergFilter(FilterComparator.IsEqual, 'test@example.com');
    expect(filter).toEqual('eq=test%40example.com');
  });

  it('should handle spaces in values', () => {
    const filter = icebergFilter(FilterComparator.Includes, 'test value');
    expect(filter).toEqual('like=%25test%20value%25');
  });

  it('should handle empty string values', () => {
    const filter = icebergFilter(FilterComparator.IsEqual, '');
    expect(filter).toEqual('eq=');
  });

  it('should handle numeric values as strings', () => {
    const filter = icebergFilter(FilterComparator.IsEqual, '123');
    expect(filter).toEqual('eq=123');
  });

  it('should throw error for unsupported comparator', () => {
    expect(() => {
      icebergFilter('unsupported' as FilterComparator, 'test');
    }).toThrow("Missing comparator implementation: 'unsupported'");
  });

  it('should handle IsIn with array containing empty strings', () => {
    const filter = icebergFilter(FilterComparator.IsIn, ['', 'test', '']);
    expect(filter).toEqual('in=,test,');
  });
});

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
      .build() as HeadersType;
    expect(requestHeaders['X-Pagination-Size']).toEqual('10');
    expect(requestHeaders['X-Pagination-Cursor']).toEqual('1');
    expect(requestHeaders.Pragma).toEqual('no-cache');
    expect(requestHeaders['x-pagination-sort']).toEqual('name');
    expect(requestHeaders['x-pagination-sort-order']).toEqual('ASC');
  });

  it('should build headers with pagination mode CachedObjectList-Pages', () => {
    const params = {
      pageSize: 20,
      cursor: 'sdfdsfndsklfndsklfnsdklfndsklf1',
      disableCache: true,
      sortBy: 'name',
      sortOrder: 'ASC',
      filters: [] as Filter[],
    };
    const requestHeaders = buildHeaders()
      .setPaginationMode()
      .setPaginationSize(params.pageSize)
      .setPaginationCursor(params.cursor)
      .setDisabledCache(params.disableCache)
      .setPaginationSort(params.sortBy, params.sortOrder)
      .setPaginationFilter(params.filters)
      .build() as HeadersType;
    expect(requestHeaders['x-pagination-mode']).toEqual(
      'CachedObjectList-Pages',
    );
    expect(requestHeaders['X-Pagination-Size']).toEqual('20');
    expect(requestHeaders['X-Pagination-Cursor']).toEqual(
      'sdfdsfndsklfndsklfnsdklfndsklf1',
    );
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
      .build() as HeadersType;
    expect(requestHeaders['x-pagination-mode']).toEqual(
      'CachedObjectList-Pages',
    );
  });

  it('should not fill IAM tags with appendIamTags', () => {
    let params = new URLSearchParams();
    params = appendIamTags(params, []);
    const iamTags = params.get('iamTags');
    expect(iamTags).toBeNull();
  });

  it('should fill IAM tags with appendIamTags', () => {
    let params = new URLSearchParams();
    const filters = createTestFilters();
    params = appendIamTags(params, filters);
    const iamTags = params.get('iamTags');

    expect(iamTags).toContain('environment');

    const parsed = JSON.parse(iamTags ?? '{}') as Record<
      string,
      { operator: FilterComparator; value: string }[]
    >;
    expect(parsed.environment?.[0]?.operator).toEqual(FilterComparator.IsEqual);
    expect(parsed.environment?.[0]?.value).toEqual('production');

    expect(iamTags).toContain('Department');
    expect(parsed.Department?.[0]?.operator).toEqual(
      FilterComparator.IsDifferent,
    );
    expect(parsed.Department?.[0]?.value).toEqual('Finance');
  });

  it('should set pagination number by default to 1', () => {
    const params = {
      pageSize: 10,
      cursor: '1',
      disableCache: true,
    };
    const requestHeaders = buildHeaders()
      .setPaginationMode()
      .setPaginationNumber()
      .setPaginationSize(params.pageSize)
      .setPaginationCursor(params.cursor)
      .setDisabledCache(params.disableCache)
      .build() as HeadersType;
    expect(requestHeaders['x-pagination-number']).toEqual('1');
  });

  it('should set pagination size by default to 5000', () => {
    const params = {
      cursor: '1',
      disableCache: true,
    };
    const requestHeaders = buildHeaders()
      .setPaginationMode()
      .setPaginationSize()
      .setPaginationCursor(params.cursor)
      .setDisabledCache(params.disableCache)
      .build() as HeadersType;
    expect(requestHeaders['X-Pagination-Size']).toEqual('5000');
  });

  it('should set pagination number', () => {
    const params = {
      pageSize: 10,
      cursor: '1',
      disableCache: true,
      page: 2,
    };
    const requestHeaders = buildHeaders()
      .setPaginationMode()
      .setPaginationNumber(params.page)
      .setPaginationSize(params.pageSize)
      .setPaginationCursor(params.cursor)
      .setDisabledCache(params.disableCache)
      .build() as HeadersType;
    expect(requestHeaders['x-pagination-number']).toEqual(
      encodeURIComponent(2),
    );
  });

  it('should test pagination filter', () => {
    const filters = [
      {
        key: 'name',
        label: 'name',
        value: 'test',
        comparator: FilterComparator.IsEqual,
        type: FilterTypeCategories.String,
      },
      {
        key: 'displayName',
        label: 'displayName',
        value: 'test',
        comparator: FilterComparator.IsEqual,
        type: FilterTypeCategories.String,
      },
    ];
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
      .setPaginationFilter(filters)
      .build() as HeadersType;
    expect(requestHeaders['x-pagination-filter']).toEqual(
      'name:eq=test&displayName:eq=test',
    );
  });

  it('should test custom header', () => {
    const requestHeaders = createHeaders({
      pageSize: 10,
      cursor: '1',
      disableCache: true,
      customHeaders: { 'X-Custom-Header': 'test' },
    });
    expect(requestHeaders['X-Custom-Header']).toEqual('test');
  });

  it('should not set pagination cursor when cursor is falsy', () => {
    const requestHeaders = createHeaders({ cursor: '' });
    expect(requestHeaders['X-Pagination-Cursor']).toBeUndefined();
  });

  it('should not set Pragma header when disableCache is false', () => {
    const requestHeaders = createHeaders({ disableCache: false });
    expect(requestHeaders.Pragma).toBeUndefined();
  });

  it('should not set Pragma header when disableCache is undefined', () => {
    const requestHeaders = createHeaders({ disableCache: undefined });
    expect(requestHeaders.Pragma).toBeUndefined();
  });
});
