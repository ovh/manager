import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useColumnFilters } from '../../../../../components';

import { useDataRetrievalOperations } from '../useDataRetrievalOperations';

// Mock dependencies
vi.mock('@ovh-ux/manager-core-api', () => ({
  FilterComparator: {
    Includes: 'includes',
  },
}));

vi.mock('../../../../../components', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useColumnFilters: vi.fn(),
  };
});

describe('useDataRetrievalOperations', () => {
  const mockColumns = [
    { id: 'name', isSearchable: true, cell: () => <></>, label: 'Name' },
    { id: 'email', isSearchable: false, cell: () => <></>, label: 'EMail' },
    { id: 'role', isSearchable: false, cell: () => <></>, label: 'Role' },
    { id: 'status', isSearchable: false, cell: () => <></>, label: 'Status' },
  ];

  const mockDefaultSorting = { id: 'name', desc: false };

  const mockUseColumnFiltersResult = {
    filters: [],
    addFilter: vi.fn(),
    removeFilter: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useColumnFilters as any).mockReturnValue(mockUseColumnFiltersResult);
  });

  it('initializes with default sorting and empty search', () => {
    const { result } = renderHook(() =>
      useDataRetrievalOperations({
        defaultSorting: mockDefaultSorting,
        columns: mockColumns,
      }),
    );

    expect(result.current.sorting).toEqual(mockDefaultSorting);
    expect(result.current.searchInput).toBe('');
    expect(result.current.searchFilters).toEqual([]);
    expect(result.current.filters).toEqual([]);
  });

  it('updates searchInput and searchFilters when onSearch is called with string', () => {
    const { result } = renderHook(() =>
      useDataRetrievalOperations({
        defaultSorting: undefined,
        columns: mockColumns,
      }),
    );

    act(() => {
      result.current.onSearch('john');
    });

    expect(result.current.searchInput).toBe('john');
    expect(result.current.searchFilters).toEqual([
      { key: 'name', value: 'john', comparator: 'includes' },
    ]);
  });

  it('clears searchFilters when onSearch is called with empty/falsy value', () => {
    const { result } = renderHook(() =>
      useDataRetrievalOperations({
        defaultSorting: undefined,
        columns: mockColumns,
      }),
    );

    // First, set a search
    act(() => {
      result.current.onSearch('alice');
    });

    expect(result.current.searchFilters).not.toBeNull();

    // Then clear it
    act(() => {
      result.current.onSearch('');
    });

    expect(result.current.searchInput).toBe('');
    expect(result.current.searchFilters).toEqual([]);
  });

  it('exposes addFilter and removeFilter from useColumnFilters', () => {
    const { result } = renderHook(() =>
      useDataRetrievalOperations({
        defaultSorting: undefined,
        columns: mockColumns,
      }),
    );

    expect(result.current.addFilter).toBe(mockUseColumnFiltersResult.addFilter);
    expect(result.current.removeFilter).toBe(
      mockUseColumnFiltersResult.removeFilter,
    );
  });

  it('allows updating sorting state', () => {
    const { result } = renderHook(() =>
      useDataRetrievalOperations({
        defaultSorting: mockDefaultSorting,
        columns: mockColumns,
      }),
    );

    const newSort = { id: 'email', desc: true };

    act(() => {
      result.current.setSorting(newSort);
    });

    expect(result.current.sorting).toEqual(newSort);
  });

  it('allows updating searchInput directly via setter', () => {
    const { result } = renderHook(() =>
      useDataRetrievalOperations({
        defaultSorting: undefined,
        columns: mockColumns,
      }),
    );

    act(() => {
      result.current.setSearchInput('manual input');
    });

    expect(result.current.searchInput).toBe('manual input');
    expect(result.current.searchFilters.length).toEqual(1);
    expect(result.current.searchFilters[0]).toEqual(
      expect.objectContaining({
        key: 'name',
        value: 'manual input',
        comparator: 'includes',
      }),
    );
  });

  it('allows updating searchFilters directly via setter', () => {
    const { result } = renderHook(() =>
      useDataRetrievalOperations({
        defaultSorting: undefined,
        columns: mockColumns,
      }),
    );

    const customFilters = [{ key: 'custom', value: 'test', comparator: 'eq' }];

    act(() => {
      result.current.setSearchFilters(customFilters);
    });

    expect(result.current.searchFilters).toEqual(customFilters);
  });
});
