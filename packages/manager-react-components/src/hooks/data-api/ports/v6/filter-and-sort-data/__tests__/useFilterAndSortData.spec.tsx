import { vi, describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import * as managerCoreApi from '@ovh-ux/manager-core-api';

import { useFilterAndSortData } from '../useFilterAndSortData';
import {
  getFilter,
  items,
  getSorting,
  columns,
  ResultObj,
} from '../../../../__tests__/Test.utils';

describe('useFilterAndSortData hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('tests with empty filtering and sorting', () => {
    vi.spyOn(managerCoreApi, 'applyFilters');
    const { result } = renderHook(() => {
      return useFilterAndSortData({
        items,
        filters: [],
        searchFilters: [],
        sorting: undefined,
        columns: [],
      });
    });
    expect(result.current.filteredAndSortedData).toEqual(items);
    expect(managerCoreApi.applyFilters).not.toHaveBeenCalled();
  });

  it('tests for search filter', () => {
    const searchTerm = 'Item 12';
    const { result } = renderHook(() => {
      return useFilterAndSortData({
        items,
        filters: [],
        searchFilters: [
          getFilter(
            'name',
            searchTerm,
            managerCoreApi.FilterComparator.IsEqual,
            managerCoreApi.FilterTypeCategories.String,
          ),
        ],
        sorting: undefined,
        columns: [],
      });
    });
    expect(result.current.filteredAndSortedData.length).toBe(1);
    expect(
      (result.current.filteredAndSortedData[0] as ResultObj).name,
    ).toContain(searchTerm);
  });

  it('tests for filter', () => {
    const searchTerm = '15';
    const { result } = renderHook(() => {
      return useFilterAndSortData({
        items,
        filters: [
          getFilter(
            'number',
            searchTerm,
            managerCoreApi.FilterComparator.IsHigher,
            managerCoreApi.FilterTypeCategories.Numeric,
          ),
        ],
        searchFilters: [],
        sorting: undefined,
        columns: [],
      });
    });
    expect(result.current.filteredAndSortedData.length).toBe(35);
    result.current.filteredAndSortedData.forEach((item) => {
      expect(parseInt(item.number, 10)).toBeGreaterThan(
        parseInt(searchTerm, 10),
      );
    });
  });

  it('tests for sort', () => {
    const { result, rerender } = renderHook(
      (obj) => {
        return useFilterAndSortData(obj);
      },
      {
        initialProps: {
          items,
          filters: [],
          searchFilters: [],
          sorting: getSorting('number', false),
          columns,
        },
      },
    );
    result.current.filteredAndSortedData.forEach((item, index) => {
      expect(parseInt(item.number, 10)).toBe(index + 1);
    });

    // sorting descending order
    rerender({
      items,
      filters: [],
      searchFilters: [],
      sorting: getSorting('number', true),
      columns,
    });
    result.current.filteredAndSortedData.forEach((item, index) => {
      expect(parseInt(item.number, 10)).toBe(items.length - index);
    });
  });

  it('tests for search filter, filter and sort', () => {
    const searchTerm = 'true';
    const { result } = renderHook(() => {
      return useFilterAndSortData({
        items,
        filters: [
          getFilter(
            'number',
            '2',
            managerCoreApi.FilterComparator.IsHigher,
            managerCoreApi.FilterTypeCategories.Numeric,
          ),
        ],
        searchFilters: [
          getFilter(
            'bool',
            searchTerm,
            managerCoreApi.FilterComparator.IsEqual,
            managerCoreApi.FilterTypeCategories.Boolean,
          ),
        ],
        sorting: getSorting('number', false),
        columns: [],
      });
    });
    result.current.filteredAndSortedData.forEach((item) => {
      expect(item.bool).toBe(searchTerm);
      expect(parseInt(item.number, 10)).toBeGreaterThan(2);
    });
  });
});
