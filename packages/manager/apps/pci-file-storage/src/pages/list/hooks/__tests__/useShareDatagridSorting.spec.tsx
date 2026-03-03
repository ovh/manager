import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useShareDatagridSorting } from '@/pages/list/hooks/useShareDatagridSorting';

describe('useShareDatagridSorting', () => {
  describe('initial state', () => {
    it('should return default sort and sortOrder', () => {
      const { result } = renderHook(() => useShareDatagridSorting());

      expect(result.current.sort).toBe('name');
      expect(result.current.sortOrder).toBe('asc');
    });

    it('should return sortingProps with single name_id column ascending', () => {
      const { result } = renderHook(() => useShareDatagridSorting());

      expect(result.current.sortingProps.sorting).toHaveLength(1);
      expect(result.current.sortingProps.sorting[0]).toEqual({
        id: 'name_id',
        desc: false,
      });
    });
  });

  describe('sort and sortOrder from column id', () => {
    it.each([
      { columnId: 'region', expectedSort: 'region' },
      { columnId: 'allocated_capacity', expectedSort: 'size' },
    ])(
      'should map column $columnId to sort $expectedSort with asc',
      ({ columnId, expectedSort }) => {
        const { result } = renderHook(() => useShareDatagridSorting());

        act(() => {
          result.current.sortingProps.setSorting([{ id: columnId, desc: false }]);
        });

        const current = result.current;
        expect(current.sort).toBe(expectedSort);
        expect(current.sortOrder).toBe('asc');
      },
    );

    it('should set sortOrder to desc when desc is true', () => {
      const { result } = renderHook(() => useShareDatagridSorting());

      act(() => {
        result.current.sortingProps.setSorting([{ id: 'name_id', desc: true }]);
      });

      expect(result.current.sort).toBe('name');
      expect(result.current.sortOrder).toBe('desc');
    });
  });

  describe('sortingProps.setSorting', () => {
    it('should toggle desc when called with same column (no new sort)', () => {
      const { result } = renderHook(() => useShareDatagridSorting());

      const first = result.current.sortingProps.sorting[0];
      expect(first?.desc).toBe(false);

      act(() => {
        result.current.sortingProps.setSorting([]);
      });

      const after = result.current.sortingProps.sorting[0];
      expect(after?.desc).toBe(true);
    });

    it('should change to new column when allowed', () => {
      const { result } = renderHook(() => useShareDatagridSorting());

      act(() => {
        result.current.sortingProps.setSorting([{ id: 'region', desc: false }]);
      });

      const first = result.current.sortingProps.sorting[0];
      expect(first).toEqual({ id: 'region', desc: false });
      expect(result.current.sort).toBe('region');
    });

    it('should toggle desc when same column id is set again', () => {
      const { result } = renderHook(() => useShareDatagridSorting());

      act(() => {
        result.current.sortingProps.setSorting([{ id: 'region', desc: false }]);
      });
      expect(result.current.sortOrder).toBe('asc');

      act(() => {
        result.current.sortingProps.setSorting([{ id: 'region', desc: true }]);
      });
      expect(result.current.sortOrder).toBe('desc');
    });

    it('should ignore disallowed column and keep previous state', () => {
      const { result } = renderHook(() => useShareDatagridSorting());

      act(() => {
        result.current.sortingProps.setSorting([{ id: 'region', desc: false }]);
      });

      act(() => {
        result.current.sortingProps.setSorting([{ id: 'disallowed_column', desc: true }]);
      });

      const first = result.current.sortingProps.sorting[0];
      expect(first?.id).toBe('region');
      expect(result.current.sort).toBe('region');
    });
  });
});
