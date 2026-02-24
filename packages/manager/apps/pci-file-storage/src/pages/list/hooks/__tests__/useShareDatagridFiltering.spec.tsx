import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FilterComparator, FilterTypeCategories } from '@ovh-ux/manager-core-api';
import type { Filter } from '@ovh-ux/manager-core-api';

import { useShareDatagridFiltering } from '@/pages/list/hooks/useShareDatagridFiltering';

type FilterWithLabel = Filter & { label: string; displayValue?: string };

type ColumnFilterProps = {
  comparator: FilterComparator;
  key: string;
  label: string;
  value: string | string[];
};

const mockAddFilter = vi.fn();
const mockRemoveFilter = vi.fn();
let mockFilters: FilterWithLabel[] = [];

vi.mock('@ovh-ux/muk', () => ({
  useColumnFilters: () => ({
    filters: mockFilters,
    addFilter: mockAddFilter,
    removeFilter: mockRemoveFilter,
  }),
}));

const makeFilter = (
  key: string,
  value: string,
  comparator: FilterComparator,
  type: FilterTypeCategories = FilterTypeCategories.String,
  label = '',
): FilterWithLabel => ({ key, value, comparator, type, label });

describe('useShareDatagridFiltering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFilters = [];
  });

  describe('initial state', () => {
    it('should return empty queryFilters when no filters or search are applied', () => {
      const { result } = renderHook(() => useShareDatagridFiltering());

      expect(result.current.queryFilters).toEqual([]);
    });

    it('should return filterProps with empty filters array', () => {
      const { result } = renderHook(() => useShareDatagridFiltering());

      expect(result.current.filterProps.filters).toEqual([]);
    });

    it('should return searchProps with empty searchInput by default', () => {
      const { result } = renderHook(() => useShareDatagridFiltering());

      expect(result.current.searchProps.searchInput).toBe('');
    });
  });

  describe('queryFilters from search', () => {
    it('should set queryFilters to name filter when search input is set', () => {
      const { result } = renderHook(() => useShareDatagridFiltering());

      act(() => {
        result.current.searchProps.onSearch('First');
      });

      expect(result.current.queryFilters).toHaveLength(1);
      expect(result.current.queryFilters[0]).toMatchObject({
        field: 'name',
        key: 'name',
        value: 'First',
        comparator: FilterComparator.Includes,
      });
    });

    it('should trim search input in queryFilters', () => {
      const { result } = renderHook(() => useShareDatagridFiltering());

      act(() => {
        result.current.searchProps.onSearch('  Share  ');
      });

      expect(result.current.queryFilters[0]).toMatchObject({
        field: 'name',
        value: 'Share',
      });
    });

    it('should return empty queryFilters when search is cleared', () => {
      const { result } = renderHook(() => useShareDatagridFiltering());

      act(() => {
        result.current.searchProps.onSearch('foo');
      });
      act(() => {
        result.current.searchProps.onSearch('');
      });

      expect(result.current.queryFilters).toEqual([]);
    });

    it('should prefer search over column filters when both are set', () => {
      mockFilters = [makeFilter('region', 'GRA9', FilterComparator.IsEqual)];

      const { result } = renderHook(() => useShareDatagridFiltering());

      act(() => {
        result.current.searchProps.onSearch('Archive');
      });

      expect(result.current.queryFilters).toHaveLength(1);
      expect(result.current.queryFilters[0]).toMatchObject({
        field: 'name',
        value: 'Archive',
      });
    });
  });

  describe('queryFilters from column filters', () => {
    it('should map name column filter to queryFilters when no search', () => {
      mockFilters = [makeFilter('name', 'Archive', FilterComparator.IsEqual)];

      const { result } = renderHook(() => useShareDatagridFiltering());

      expect(result.current.queryFilters).toHaveLength(1);
      expect(result.current.queryFilters[0]).toMatchObject({
        field: 'name',
        key: 'name',
        value: 'Archive',
      });
    });

    it('should map region column filter to queryFilters when no search', () => {
      mockFilters = [makeFilter('region', 'GRA9', FilterComparator.IsEqual)];

      const { result } = renderHook(() => useShareDatagridFiltering());

      expect(result.current.queryFilters).toHaveLength(1);
      expect(result.current.queryFilters[0]).toMatchObject({
        field: 'region',
        value: 'GRA9',
      });
    });

    it('should not include protocol or status in queryFilters (not API fields)', () => {
      mockFilters = [makeFilter('protocol', 'CIFS', FilterComparator.IsEqual)];

      const { result } = renderHook(() => useShareDatagridFiltering());

      expect(result.current.queryFilters).toEqual([]);
    });
  });

  describe('filterProps', () => {
    it('should call addFilter when filterProps.add is called', () => {
      const { result } = renderHook(() => useShareDatagridFiltering());

      const filterToAdd: ColumnFilterProps = {
        key: 'name',
        value: 'Archive',
        comparator: FilterComparator.IsEqual,
        label: 'Name',
      };

      act(() => {
        result.current.filterProps.add(filterToAdd);
      });

      expect(mockAddFilter).toHaveBeenCalledTimes(1);
      expect(mockAddFilter).toHaveBeenCalledWith(
        expect.objectContaining({
          key: 'name',
          value: 'Archive',
          comparator: FilterComparator.IsEqual,
          label: 'Name',
        }),
      );
    });

    it('should call removeFilter when filterProps.remove is called', () => {
      const existingFilter = makeFilter('name', 'Archive', FilterComparator.IsEqual);
      mockFilters = [existingFilter];

      const { result } = renderHook(() => useShareDatagridFiltering());

      const filterToRemove: Filter = {
        key: 'name',
        value: 'Archive',
        comparator: FilterComparator.IsEqual,
      };

      act(() => {
        result.current.filterProps.remove(filterToRemove as FilterWithLabel);
      });

      expect(mockRemoveFilter).toHaveBeenCalledTimes(1);
      expect(mockRemoveFilter).toHaveBeenCalledWith(filterToRemove);
    });

    it('should expose the current filters array via filterProps.filters', () => {
      const activeFilter = makeFilter('region', 'GRA9', FilterComparator.IsEqual);
      mockFilters = [activeFilter];

      const { result } = renderHook(() => useShareDatagridFiltering());

      expect(result.current.filterProps.filters).toEqual([activeFilter]);
    });
  });

  describe('searchProps', () => {
    it('should update searchInput when onSearch is called', () => {
      const { result } = renderHook(() => useShareDatagridFiltering());

      expect(result.current.searchProps.searchInput).toBe('');

      act(() => {
        result.current.searchProps.onSearch('Share');
      });

      expect(result.current.searchProps.searchInput).toBe('Share');
    });
  });
});
