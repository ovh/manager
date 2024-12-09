import { v6 } from '@ovh-ux/manager-core-api';
import { describe, it, vi } from 'vitest';
import {
  activateMonthlyBilling,
  getCurrentUsage,
  paginateResults,
} from './consumption';

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    get: vi.fn(() => ({ data: null })),
    post: vi.fn(() => ({ data: null })),
  },
}));

describe('consumption', () => {
  it('getCurrentUsage', async () => {
    getCurrentUsage('projectId');
    expect(v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/usage/current',
    );
  });

  it('activateMonthlyBilling', async () => {
    activateMonthlyBilling('projectId-12345', 'instanceId-8888');
    expect(v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId-12345/instance/instanceId-8888/activeMonthlyBilling',
    );
  });

  describe('paginateResults', () => {
    const mockItems = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
      { id: 4, name: 'Item 4' },
      { id: 5, name: 'Item 5' },
      { id: 6, name: 'Item 6' },
      { id: 7, name: 'Item 7' },
      { id: 8, name: 'Item 8' },
    ];

    it('should correctly paginate results for the first page', () => {
      const pagination = { pageIndex: 0, pageSize: 3 };
      const result = paginateResults(mockItems, pagination);

      expect(result.rows).toEqual([
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
      ]);
      expect(result.pageCount).toBe(3);
      expect(result.totalRows).toBe(8);
    });

    it('should correctly paginate results for the second page', () => {
      const pagination = { pageIndex: 1, pageSize: 3 };
      const result = paginateResults(mockItems, pagination);

      expect(result.rows).toEqual([
        { id: 4, name: 'Item 4' },
        { id: 5, name: 'Item 5' },
        { id: 6, name: 'Item 6' },
      ]);
      expect(result.pageCount).toBe(3);
      expect(result.totalRows).toBe(8);
    });

    it('should handle the last page with fewer items', () => {
      const pagination = { pageIndex: 2, pageSize: 3 };
      const result = paginateResults(mockItems, pagination);

      expect(result.rows).toEqual([
        { id: 7, name: 'Item 7' },
        { id: 8, name: 'Item 8' },
      ]);
      expect(result.pageCount).toBe(3);
      expect(result.totalRows).toBe(8);
    });

    it('should return an empty array for an out-of-range page', () => {
      const pagination = { pageIndex: 3, pageSize: 3 };
      const result = paginateResults(mockItems, pagination);

      expect(result.rows).toEqual([]);
      expect(result.pageCount).toBe(3);
      expect(result.totalRows).toBe(8);
    });

    it('should handle empty input array', () => {
      const pagination = { pageIndex: 0, pageSize: 3 };
      const result = paginateResults([], pagination);

      expect(result.rows).toEqual([]);
      expect(result.pageCount).toBe(0);
      expect(result.totalRows).toBe(0);
    });

    it('should handle different page sizes', () => {
      const pagination = { pageIndex: 1, pageSize: 5 };
      const result = paginateResults(mockItems, pagination);

      expect(result.rows).toEqual([
        { id: 6, name: 'Item 6' },
        { id: 7, name: 'Item 7' },
        { id: 8, name: 'Item 8' },
      ]);
      expect(result.pageCount).toBe(2);
      expect(result.totalRows).toBe(8);
    });
  });
});
