/* eslint-disable @typescript-eslint/unbound-method */
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { v2, v6 } from '../client.js';
import {
  fetchIcebergV2,
  fetchIcebergV6,
  fetchWithIceberg,
  getRouteWithParams,
} from '../iceberg.js';
import { FilterComparator, FilterTypeCategories } from '../types/filters.type.js';

vi.mock('../client.js', () => {
  return {
    v6: { get: vi.fn() },
    v2: { get: vi.fn() },
    aapi: { get: vi.fn() },
    ws: { get: vi.fn() },
  };
});

const mockV6Response = <T>(data: T, headers: Record<string, string | undefined> = {}): void => {
  const response: AxiosResponse<T> = {
    data,
    headers,
    status: 200,
    statusText: 'OK',
    config: {} as InternalAxiosRequestConfig,
  };
  vi.mocked(v6.get).mockResolvedValue(response);
};

const mockV2Response = <T>(data: T, headers: Record<string, string | undefined> = {}): void => {
  const response: AxiosResponse<T> = {
    data,
    headers,
    status: 200,
    statusText: 'OK',
    config: {} as InternalAxiosRequestConfig,
  };
  vi.mocked(v2.get).mockResolvedValue(response);
};

const expectHeaders = (headers: Record<string, string>) =>
  expect.objectContaining(headers) as unknown as Record<string, unknown>;

describe('fetchWithIceberg', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('makes a call to v2', async () => {
    mockV2Response([{ id: 1, name: 'test' }], {
      'x-pagination-cursor-next': 'next-cursor',
    });
    await fetchWithIceberg({
      version: 'v2',
      route: 'sample/route',
    });
    expect(v2.get).toHaveBeenCalled();
  });

  it('makes a call to v6', async () => {
    mockV6Response([{ id: 1, name: 'test' }], {
      'x-pagination-elements': '1',
    });
    await fetchWithIceberg({
      version: 'v6',
      route: 'sample/route',
    });
    expect(v6.get).toHaveBeenCalledOnce();
  });

  it('should fetch data with a single value isIn filter comparator', async () => {
    mockV6Response([{ id: 1, name: 'test' }], {
      'x-pagination-elements': '1',
    });

    const filters = [
      {
        key: 'name',
        value: ['test'],
        comparator: FilterComparator.IsIn,
        type: FilterTypeCategories.String,
      },
    ];

    const result = await fetchWithIceberg({
      version: 'v6',
      route: '/test',
      page: 2,
      pageSize: 20,
      filters,
      sortBy: 'name',
      sortOrder: 'DESC',
      disableCache: true,
    });

    expect(result).toEqual({
      data: [{ id: 1, name: 'test' }],
      totalCount: 1,
      status: 200,
    });

    expect(v6.get).toHaveBeenCalledWith('/test', {
      headers: expectHeaders({
        'x-pagination-mode': 'CachedObjectList-Pages',
        'x-pagination-number': '2',
        'X-Pagination-Size': '20',
        'x-pagination-sort': 'name',
        'x-pagination-sort-order': 'DESC',
        'x-pagination-filter': 'name:eq=test',
        Pragma: 'no-cache',
      }),
    });
  });

  it('should fetch data with an array value isIn filter comparator', async () => {
    mockV6Response([{ id: 1, name: 'test' }], {
      'x-pagination-elements': '1',
    });

    const filters = [
      {
        key: 'name',
        value: ['test', 'otherTest'],
        comparator: FilterComparator.IsIn,
        type: FilterTypeCategories.String,
      },
    ];

    const result = await fetchWithIceberg({
      version: 'v6',
      route: '/test',
      page: 2,
      pageSize: 20,
      filters,
      sortBy: 'name',
      sortOrder: 'DESC',
      disableCache: true,
    });

    expect(result).toEqual({
      data: [{ id: 1, name: 'test' }],
      totalCount: 1,
      status: 200,
    });

    expect(v6.get).toHaveBeenCalledWith('/test', {
      headers: expectHeaders({
        'x-pagination-mode': 'CachedObjectList-Pages',
        'x-pagination-number': '2',
        'X-Pagination-Size': '20',
        'x-pagination-sort': 'name',
        'x-pagination-sort-order': 'DESC',
        'x-pagination-filter': 'name:in=test,otherTest',
        Pragma: 'no-cache',
      }),
    });
  });

  it('should fetch data with filters and tags', async () => {
    mockV6Response([{ id: 1, name: 'test' }], {
      'x-pagination-elements': '1',
    });

    const filters = [
      {
        key: 'name',
        value: 'test',
        comparator: FilterComparator.IsEqual,
        type: FilterTypeCategories.String,
      },
      {
        key: 'tags',
        tagKey: 'environment',
        value: 'production',
        comparator: FilterComparator.IsEqual,
        type: FilterTypeCategories.Tags,
      },
    ];

    const result = await fetchWithIceberg({
      version: 'v6',
      route: '/test',
      page: 2,
      pageSize: 20,
      filters,
      sortBy: 'name',
      sortOrder: 'DESC',
      disableCache: true,
    });

    expect(result).toEqual({
      data: [{ id: 1, name: 'test' }],
      totalCount: 1,
      status: 200,
    });

    expect(v6.get).toHaveBeenCalledWith(
      '/test?iamTags=%7B%22environment%22%3A%5B%7B%22operator%22%3A%22is_equal%22%2C%22value%22%3A%22production%22%7D%5D%7D',
      {
        headers: expectHeaders({
          'x-pagination-mode': 'CachedObjectList-Pages',
          'x-pagination-number': '2',
          'X-Pagination-Size': '20',
          'x-pagination-sort': 'name',
          'x-pagination-sort-order': 'DESC',
          'x-pagination-filter': 'name:eq=test',
          Pragma: 'no-cache',
        }),
      },
    );
  });

  it('should handle route with existing query parameters', async () => {
    mockV2Response([{ id: 1, name: 'test' }], { 'x-pagination-elements': '1' });

    const result = await fetchWithIceberg({
      version: 'v2',
      route: '/test?existing=param',
      pageSize: 10,
      filters: [
        {
          key: 'name',
          value: 'test',
          comparator: FilterComparator.IsEqual,
          type: FilterTypeCategories.String,
        },
      ],
      sortBy: 'name',
      sortOrder: 'ASC',
      disableCache: false,
    });

    expect(result).toEqual({
      data: [{ id: 1, name: 'test' }],
      status: 200,
      totalCount: 1,
    });

    expect(v2.get).toHaveBeenCalledWith('/test?existing=param', {
      headers: expectHeaders({
        'X-Pagination-Size': '10',
        'x-pagination-filter': 'name:eq=test',
        'x-pagination-sort': 'name',
        'x-pagination-sort-order': 'ASC',
      }),
    });
  });
});

describe('fetchIcebergV6', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch data with basic parameters', async () => {
    mockV6Response([{ id: 1, name: 'test' }], {
      'x-pagination-elements': '1',
    });

    const result = await fetchIcebergV6({
      route: '/test',
      page: 1,
      pageSize: 10,
      filters: [],
      sortBy: 'name',
      sortReverse: false,
      disableCache: false,
    });

    expect(result).toEqual({
      data: [{ id: 1, name: 'test' }],
      totalCount: 1,
      status: 200,
    });

    expect(v6.get).toHaveBeenCalledWith('/test', {
      headers: expectHeaders({
        'x-pagination-mode': 'CachedObjectList-Pages',
        'x-pagination-number': '1',
        'X-Pagination-Size': '10',
      }),
    });
  });

  it('should fetch data with filters and tags', async () => {
    mockV6Response([{ id: 1, name: 'test' }], {
      'x-pagination-elements': '1',
    });

    const filters = [
      {
        key: 'name',
        value: 'test',
        comparator: FilterComparator.IsEqual,
        type: FilterTypeCategories.String,
      },
      {
        key: 'tags',
        tagKey: 'environment',
        value: 'production',
        comparator: FilterComparator.IsEqual,
        type: FilterTypeCategories.Tags,
      },
    ];

    const result = await fetchIcebergV6({
      route: '/test',
      page: 2,
      pageSize: 20,
      filters,
      sortBy: 'name',
      sortReverse: true,
      disableCache: true,
    });

    expect(result).toEqual({
      data: [{ id: 1, name: 'test' }],
      totalCount: 1,
      status: 200,
    });

    expect(v6.get).toHaveBeenCalledWith(
      '/test?iamTags=%7B%22environment%22%3A%5B%7B%22operator%22%3A%22is_equal%22%2C%22value%22%3A%22production%22%7D%5D%7D',
      {
        headers: expectHeaders({
          'x-pagination-mode': 'CachedObjectList-Pages',
          'x-pagination-number': '2',
          'X-Pagination-Size': '20',
          'x-pagination-sort': 'name',
          'x-pagination-sort-order': 'DESC',
          'x-pagination-filter': 'name:eq=test',
          Pragma: 'no-cache',
        }),
      },
    );
  });

  it('should fetch data with a single value isIn filter comparator', async () => {
    mockV6Response([{ id: 1, name: 'test' }], {
      'x-pagination-elements': '1',
    });

    const filters = [
      {
        key: 'name',
        value: ['test'],
        comparator: FilterComparator.IsIn,
        type: FilterTypeCategories.String,
      },
    ];

    const result = await fetchIcebergV6({
      route: '/test',
      page: 2,
      pageSize: 20,
      filters,
      sortBy: 'name',
      sortReverse: true,
      disableCache: true,
    });

    expect(result).toEqual({
      data: [{ id: 1, name: 'test' }],
      totalCount: 1,
      status: 200,
    });

    expect(v6.get).toHaveBeenCalledWith('/test', {
      headers: expectHeaders({
        'x-pagination-mode': 'CachedObjectList-Pages',
        'x-pagination-number': '2',
        'X-Pagination-Size': '20',
        'x-pagination-sort': 'name',
        'x-pagination-sort-order': 'DESC',
        'x-pagination-filter': 'name:eq=test',
        Pragma: 'no-cache',
      }),
    });
  });

  it('should fetch data with an array value isIn filter comparator', async () => {
    mockV6Response([{ id: 1, name: 'test' }], {
      'x-pagination-elements': '1',
    });

    const filters = [
      {
        key: 'name',
        value: ['test', 'otherTest'],
        comparator: FilterComparator.IsIn,
        type: FilterTypeCategories.String,
      },
    ];

    const result = await fetchIcebergV6({
      route: '/test',
      page: 2,
      pageSize: 20,
      filters,
      sortBy: 'name',
      sortReverse: true,
      disableCache: true,
    });

    expect(result).toEqual({
      data: [{ id: 1, name: 'test' }],
      totalCount: 1,
      status: 200,
    });

    expect(v6.get).toHaveBeenCalledWith('/test', {
      headers: expectHeaders({
        'x-pagination-mode': 'CachedObjectList-Pages',
        'x-pagination-number': '2',
        'X-Pagination-Size': '20',
        'x-pagination-sort': 'name',
        'x-pagination-sort-order': 'DESC',
        'x-pagination-filter': 'name:in=test,otherTest',
        Pragma: 'no-cache',
      }),
    });
  });

  it('should handle missing x-pagination-elements header', async () => {
    mockV6Response([{ id: 1, name: 'test' }], {
      // Missing x-pagination-elements header
    });

    const result = await fetchIcebergV6({
      route: '/test',
      page: 1,
      pageSize: 10,
      filters: [],
      sortBy: 'name',
      sortReverse: false,
      disableCache: false,
    });

    expect(result).toEqual({
      data: [{ id: 1, name: 'test' }],
      totalCount: 0,
      status: 200,
    });
  });
});

describe('fetchIcebergV2', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch data with basic parameters', async () => {
    mockV2Response([{ id: 1, name: 'test' }], {
      'x-pagination-cursor-next': 'next-cursor',
    });

    const result = await fetchIcebergV2({
      route: '/test',
      pageSize: 10,
      cursor: 'current-cursor',
      filters: [],
      sortBy: 'name',
      sortOrder: 'ASC',
      disableCache: false,
    });

    expect(result).toEqual({
      data: [{ id: 1, name: 'test' }],
      cursorNext: 'next-cursor',
      status: 200,
    });

    expect(v2.get).toHaveBeenCalledWith('/test', {
      headers: expectHeaders({
        'X-Pagination-Size': '10',
        'X-Pagination-Cursor': 'current-cursor',
        'x-pagination-sort': 'name',
        'x-pagination-sort-order': 'ASC',
      }),
    });
  });

  it('should fetch data with filters and IAM tags', async () => {
    mockV2Response([{ id: 1, name: 'test' }], {
      'x-pagination-cursor-next': 'next-cursor',
    });

    const filters = [
      {
        key: 'name',
        value: 'test',
        comparator: FilterComparator.IsEqual,
        type: FilterTypeCategories.String,
      },
      {
        key: 'tags',
        tagKey: 'environment',
        value: 'production',
        comparator: FilterComparator.IsEqual,
        type: FilterTypeCategories.Tags,
      },
    ];

    const result = await fetchIcebergV2({
      route: '/iam/resource/test',
      pageSize: 20,
      cursor: 'current-cursor',
      filters,
      sortBy: 'name',
      sortOrder: 'DESC',
      disableCache: true,
    });

    expect(result).toEqual({
      data: [{ id: 1, name: 'test' }],
      cursorNext: 'next-cursor',
      status: 200,
    });

    expect(v2.get).toHaveBeenCalledWith(
      '/iam/resource/test?tags=%7B%22environment%22%3A%5B%7B%22operator%22%3A%22is_equal%22%2C%22value%22%3A%22production%22%7D%5D%7D',
      {
        headers: expectHeaders({
          'X-Pagination-Size': '20',
          'X-Pagination-Cursor': 'current-cursor',
          'x-pagination-sort': 'name',
          'x-pagination-sort-order': 'DESC',
          'x-pagination-filter': 'name:eq=test',
          Pragma: 'no-cache',
        }),
      },
    );
  });

  it('should handle route with existing query parameters', async () => {
    mockV2Response([{ id: 1, name: 'test' }], {
      'x-pagination-cursor-next': 'next-cursor',
    });

    const result = await fetchIcebergV2({
      route: '/test?existing=param',
      pageSize: 10,
      cursor: 'current-cursor',
      filters: [
        {
          key: 'name',
          value: 'test',
          comparator: FilterComparator.IsEqual,
          type: FilterTypeCategories.String,
        },
      ],
      sortBy: 'name',
      sortOrder: 'ASC',
      disableCache: false,
    });

    expect(result).toEqual({
      data: [{ id: 1, name: 'test' }],
      cursorNext: 'next-cursor',
      status: 200,
    });

    expect(v2.get).toHaveBeenCalledWith('/test?existing=param', {
      headers: expectHeaders({
        'X-Pagination-Size': '10',
        'X-Pagination-Cursor': 'current-cursor',
        'x-pagination-filter': 'name:eq=test',
        'x-pagination-sort': 'name',
        'x-pagination-sort-order': 'ASC',
      }),
    });
  });
});

describe('getRouteWithParams', () => {
  it('should return route with params when params are provided', () => {
    const route = '/test';
    const params = new URLSearchParams();
    params.set('param1', 'value1');
    const result = getRouteWithParams(route, params);
    expect(result).toEqual('/test?param1=value1');
  });

  it('should return route with & when params are provided', () => {
    const route = '/test?existing=param';
    const params = new URLSearchParams();
    params.set('param1', 'value1');
    params.set('param2', 'value2');
    const result = getRouteWithParams(route, params);
    expect(result).toEqual('/test?existing=param&param1=value1&param2=value2');
  });
});
