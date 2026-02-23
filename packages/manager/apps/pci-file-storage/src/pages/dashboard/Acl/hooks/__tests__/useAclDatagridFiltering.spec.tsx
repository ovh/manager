import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FilterComparator, FilterTypeCategories } from '@ovh-ux/manager-core-api';
import type { Filter } from '@ovh-ux/manager-core-api';

import type {
  TAclData,
  TPermissionOption,
  TStatusOption,
} from '@/pages/dashboard/Acl/acl.view-model';
import { useAclDatagridFiltering } from '@/pages/dashboard/Acl/hooks/useAclDatagridFiltering';

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

const makeStatusDisplay = () => ({
  labelKey: 'acl_status_active',
  badgeColor: 'success' as const,
});

const makeAcl = (overrides: Partial<TAclData> & { id: string; accessTo: string }): TAclData => ({
  permission: 'readOnly' as TPermissionOption,
  status: 'active' as TStatusOption,
  statusDisplay: makeStatusDisplay(),
  ...overrides,
});

const ACL_FIXTURES: TAclData[] = [
  makeAcl({ id: '1', accessTo: '10.0.0.1' }),
  makeAcl({ id: '2', accessTo: '10.0.0.2' }),
  makeAcl({ id: '3', accessTo: '192.168.1.1', permission: 'readAndWrite' }),
  makeAcl({ id: '4', accessTo: '172.16.0.0/24', permission: 'readAndWrite' }),
  makeAcl({ id: '5', accessTo: '10.10.0.1' }),
];

const makeFilter = (
  key: string,
  value: string,
  comparator: FilterComparator,
  type: FilterTypeCategories = FilterTypeCategories.String,
  label = '',
): FilterWithLabel => ({ key, value, comparator, type, label });

describe('useAclDatagridFiltering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFilters = [];
  });

  describe('initial state', () => {
    it('should return all ACLs when no filters or search are applied', () => {
      const { result } = renderHook(() => useAclDatagridFiltering(ACL_FIXTURES));

      expect(result.current.filteredAcls).toEqual(ACL_FIXTURES);
    });

    it('should return filterProps with empty filters array', () => {
      const { result } = renderHook(() => useAclDatagridFiltering(ACL_FIXTURES));

      expect(result.current.filterProps.filters).toEqual([]);
    });

    it('should return searchProps with empty searchInput by default', () => {
      const { result } = renderHook(() => useAclDatagridFiltering(ACL_FIXTURES));

      expect(result.current.searchProps.searchInput).toBe('');
    });
  });

  describe('search filtering', () => {
    it('should filter by search query on accessTo field (case-insensitive contains)', () => {
      const { result } = renderHook(() => useAclDatagridFiltering(ACL_FIXTURES));

      act(() => {
        result.current.searchProps.onSearch('10.0.0');
      });

      expect(result.current.filteredAcls).toHaveLength(2);
      expect(result.current.filteredAcls.map((a) => a.accessTo)).toEqual(['10.0.0.1', '10.0.0.2']);
    });

    it('should filter by search query case-insensitively', () => {
      const mixedCaseAcls: TAclData[] = [
        makeAcl({ id: '1', accessTo: 'ABC.DEF.1.1' }),
        makeAcl({ id: '2', accessTo: '10.0.0.1' }),
      ];

      const { result } = renderHook(() => useAclDatagridFiltering(mixedCaseAcls));

      act(() => {
        result.current.searchProps.onSearch('abc');
      });

      expect(result.current.filteredAcls).toHaveLength(1);
      expect(result.current.filteredAcls[0]?.accessTo).toBe('ABC.DEF.1.1');
    });

    it('should return all ACLs when search query is empty', () => {
      const { result } = renderHook(() => useAclDatagridFiltering(ACL_FIXTURES));

      act(() => {
        result.current.searchProps.onSearch('10.0.0');
      });

      act(() => {
        result.current.searchProps.onSearch('');
      });

      expect(result.current.filteredAcls).toEqual(ACL_FIXTURES);
    });

    it('should return empty array when no matches', () => {
      const { result } = renderHook(() => useAclDatagridFiltering(ACL_FIXTURES));

      act(() => {
        result.current.searchProps.onSearch('999.999.999.999');
      });

      expect(result.current.filteredAcls).toHaveLength(0);
    });
  });

  describe('column filter integration', () => {
    it('should apply column filters via applyFilters (IsEqual on accessTo)', () => {
      mockFilters = [makeFilter('accessTo', '10.0.0.1', FilterComparator.IsEqual)];

      const { result } = renderHook(() => useAclDatagridFiltering(ACL_FIXTURES));

      expect(result.current.filteredAcls).toHaveLength(1);
      expect(result.current.filteredAcls[0]?.accessTo).toBe('10.0.0.1');
    });

    it('should apply column filters via applyFilters (Includes on accessTo)', () => {
      mockFilters = [makeFilter('accessTo', '10.0', FilterComparator.Includes)];

      const { result } = renderHook(() => useAclDatagridFiltering(ACL_FIXTURES));

      expect(result.current.filteredAcls).toHaveLength(3);
      expect(result.current.filteredAcls.map((a) => a.accessTo)).toEqual([
        '10.0.0.1',
        '10.0.0.2',
        '10.10.0.1',
      ]);
    });

    it('should apply Options filter on permission column (IsEqual)', () => {
      mockFilters = [
        makeFilter(
          'permission',
          'readAndWrite',
          FilterComparator.IsEqual,
          FilterTypeCategories.Options,
        ),
      ];

      const { result } = renderHook(() => useAclDatagridFiltering(ACL_FIXTURES));

      expect(result.current.filteredAcls).toHaveLength(2);
      expect(result.current.filteredAcls.every((a) => a.permission === 'readAndWrite')).toBe(true);
    });

    it('should apply Options filter on status column (Includes)', () => {
      const aclsWithStatuses: TAclData[] = [
        makeAcl({ id: '1', accessTo: '10.0.0.1', status: 'active' }),
        makeAcl({ id: '2', accessTo: '10.0.0.2', status: 'activating' }),
        makeAcl({ id: '3', accessTo: '10.0.0.3', status: 'deleting' }),
      ];

      mockFilters = [
        makeFilter('status', 'activ', FilterComparator.Includes, FilterTypeCategories.Options),
      ];

      const { result } = renderHook(() => useAclDatagridFiltering(aclsWithStatuses));

      expect(result.current.filteredAcls).toHaveLength(2);
      expect(result.current.filteredAcls.map((a) => a.status)).toEqual(['active', 'activating']);
    });

    it('should apply Options filter on status column (IsDifferent)', () => {
      const aclsWithStatuses: TAclData[] = [
        makeAcl({ id: '1', accessTo: '10.0.0.1', status: 'active' }),
        makeAcl({ id: '2', accessTo: '10.0.0.2', status: 'activating' }),
        makeAcl({ id: '3', accessTo: '10.0.0.3', status: 'deleting' }),
      ];

      mockFilters = [
        makeFilter('status', 'active', FilterComparator.IsDifferent, FilterTypeCategories.Options),
      ];

      const { result } = renderHook(() => useAclDatagridFiltering(aclsWithStatuses));

      expect(result.current.filteredAcls).toHaveLength(2);
      expect(result.current.filteredAcls.map((a) => a.status)).toEqual(['activating', 'deleting']);
    });

    it('should apply multiple column filters with AND logic', () => {
      mockFilters = [
        makeFilter('accessTo', '172', FilterComparator.Includes),
        makeFilter(
          'permission',
          'readAndWrite',
          FilterComparator.IsEqual,
          FilterTypeCategories.Options,
        ),
      ];

      const { result } = renderHook(() => useAclDatagridFiltering(ACL_FIXTURES));

      expect(result.current.filteredAcls).toHaveLength(1);
      expect(result.current.filteredAcls[0]?.accessTo).toBe('172.16.0.0/24');
      expect(result.current.filteredAcls[0]?.permission).toBe('readAndWrite');
    });
  });

  describe('cumulative filtering (search + column filters)', () => {
    it('should apply both search and column filters simultaneously', () => {
      mockFilters = [
        makeFilter(
          'permission',
          'readAndWrite',
          FilterComparator.IsEqual,
          FilterTypeCategories.Options,
        ),
      ];

      const { result } = renderHook(() => useAclDatagridFiltering(ACL_FIXTURES));

      act(() => {
        result.current.searchProps.onSearch('192');
      });

      expect(result.current.filteredAcls).toHaveLength(1);
      expect(result.current.filteredAcls[0]?.accessTo).toBe('192.168.1.1');
    });
  });

  describe('filterProps', () => {
    it('should call addFilter from useColumnFilters when filterProps.add is called', () => {
      const { result } = renderHook(() => useAclDatagridFiltering(ACL_FIXTURES));

      const filterToAdd: ColumnFilterProps = {
        key: 'accessTo',
        value: '10.0.0.1',
        comparator: FilterComparator.IsEqual,
        label: 'Access to',
      };

      act(() => {
        result.current.filterProps.add(filterToAdd);
      });

      expect(mockAddFilter).toHaveBeenCalledTimes(1);
      expect(mockAddFilter).toHaveBeenCalledWith(
        expect.objectContaining({
          key: 'accessTo',
          value: '10.0.0.1',
          comparator: FilterComparator.IsEqual,
          label: 'Access to',
        }),
      );
    });

    it('should call removeFilter from useColumnFilters when filterProps.remove is called', () => {
      const existingFilter: FilterWithLabel = makeFilter(
        'accessTo',
        '10.0.0.1',
        FilterComparator.IsEqual,
      );
      mockFilters = [existingFilter];

      const { result } = renderHook(() => useAclDatagridFiltering(ACL_FIXTURES));

      const filterToRemove: Filter = {
        key: 'accessTo',
        value: '10.0.0.1',
        comparator: FilterComparator.IsEqual,
      };

      act(() => {
        result.current.filterProps.remove(filterToRemove as FilterWithLabel);
      });

      expect(mockRemoveFilter).toHaveBeenCalledTimes(1);
      expect(mockRemoveFilter).toHaveBeenCalledWith(filterToRemove);
    });

    it('should expose the current filters array via filterProps.filters', () => {
      const activeFilter: FilterWithLabel = makeFilter(
        'accessTo',
        '10.0.0.1',
        FilterComparator.IsEqual,
      );
      mockFilters = [activeFilter];

      const { result } = renderHook(() => useAclDatagridFiltering(ACL_FIXTURES));

      expect(result.current.filterProps.filters).toEqual([activeFilter]);
    });

    it('should set displayValue to undefined when no map entry exists for the column', () => {
      const { result } = renderHook(() => useAclDatagridFiltering(ACL_FIXTURES));

      const filterToAdd: ColumnFilterProps = {
        key: 'accessTo',
        value: '10.0.0.1',
        comparator: FilterComparator.IsEqual,
        label: 'Access to',
      };

      act(() => {
        result.current.filterProps.add(filterToAdd);
      });

      expect(mockAddFilter).toHaveBeenCalledWith(
        expect.objectContaining({
          key: 'accessTo',
          value: '10.0.0.1',
          displayValue: undefined,
        }),
      );
    });

    it('should set displayValue to undefined when no map is provided at all', () => {
      const { result } = renderHook(() => useAclDatagridFiltering(ACL_FIXTURES));

      const filterToAdd: ColumnFilterProps = {
        key: 'permission',
        value: 'readOnly',
        comparator: FilterComparator.IsEqual,
        label: 'Access rights',
      };

      act(() => {
        result.current.filterProps.add(filterToAdd);
      });

      expect(mockAddFilter).toHaveBeenCalledWith(
        expect.objectContaining({
          displayValue: undefined,
        }),
      );
    });
  });

  describe('searchProps', () => {
    it('should update searchInput when onSearch is called', () => {
      const { result } = renderHook(() => useAclDatagridFiltering(ACL_FIXTURES));

      expect(result.current.searchProps.searchInput).toBe('');

      act(() => {
        result.current.searchProps.onSearch('10.0.0');
      });

      expect(result.current.searchProps.searchInput).toBe('10.0.0');
    });

    it('should update searchInput via setSearchInput', () => {
      const { result } = renderHook(() => useAclDatagridFiltering(ACL_FIXTURES));

      act(() => {
        result.current.searchProps.setSearchInput('192.168');
      });

      expect(result.current.searchProps.searchInput).toBe('192.168');
    });

    it('should reflect updated searchInput in filtered results when set via setSearchInput', () => {
      const { result } = renderHook(() => useAclDatagridFiltering(ACL_FIXTURES));

      act(() => {
        result.current.searchProps.setSearchInput('192.168');
      });

      expect(result.current.filteredAcls).toHaveLength(1);
      expect(result.current.filteredAcls[0]?.accessTo).toBe('192.168.1.1');
    });
  });
});
