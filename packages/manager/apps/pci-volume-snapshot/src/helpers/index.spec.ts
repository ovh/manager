import { describe, it, expect } from 'vitest';
import { PaginationState } from '@ovh-ux/manager-react-components';
import { ColumnSort } from '@tanstack/react-table';
import { paginateResults, compareFunction, sortResults } from './index';

describe('Helper functions', () => {
  describe('paginateResults', () => {
    const mockData = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
      { id: 4, name: 'Item 4' },
      { id: 5, name: 'Item 5' },
      { id: 6, name: 'Item 6' },
      { id: 7, name: 'Item 7' },
    ];

    it('should return first page correctly', () => {
      const pagination: PaginationState = { pageIndex: 0, pageSize: 3 };
      const result = paginateResults(mockData, pagination);

      expect(result.rows).toHaveLength(3);
      expect(result.rows[0].id).toBe(1);
      expect(result.rows[2].id).toBe(3);
      expect(result.pageCount).toBe(3);
      expect(result.totalRows).toBe(7);
    });

    it('should return second page correctly', () => {
      const pagination: PaginationState = { pageIndex: 1, pageSize: 3 };
      const result = paginateResults(mockData, pagination);

      expect(result.rows).toHaveLength(3);
      expect(result.rows[0].id).toBe(4);
      expect(result.rows[2].id).toBe(6);
      expect(result.pageCount).toBe(3);
    });

    it('should handle last page with fewer items', () => {
      const pagination: PaginationState = { pageIndex: 2, pageSize: 3 };
      const result = paginateResults(mockData, pagination);

      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].id).toBe(7);
    });

    it('should handle empty array', () => {
      const pagination: PaginationState = { pageIndex: 0, pageSize: 5 };
      const result = paginateResults([], pagination);

      expect(result.rows).toHaveLength(0);
      expect(result.pageCount).toBe(0);
      expect(result.totalRows).toBe(0);
    });
  });

  describe('compareFunction', () => {
    it('should compare strings correctly', () => {
      const compare = compareFunction('name');
      const result = compare({ name: 'apple' }, { name: 'banana' });
      const reverseResult = compare({ name: 'banana' }, { name: 'apple' });

      expect(result).toBeLessThan(0);
      expect(reverseResult).toBeGreaterThan(0);
    });

    it('should compare numbers correctly', () => {
      const compare = compareFunction('value');
      const result = compare({ value: 10 }, { value: 20 });
      const equalResult = compare({ value: 10 }, { value: 10 });

      expect(result).toBeLessThan(0);
      expect(equalResult).toBe(0);
    });

    it('should handle undefined values', () => {
      const compare = compareFunction('name');
      const result = compare({ name: undefined }, { name: 'banana' });

      expect(result).toBeLessThan(0); // empty string compared to 'banana'
    });
  });

  describe('sortResults', () => {
    const mockData = [
      { id: 1, name: 'Banana', value: 50 },
      { id: 2, name: 'Apple', value: 10 },
      { id: 3, name: 'Cherry', value: 5 },
    ];

    it('should sort by name in ascending order', () => {
      const sorting: ColumnSort = { id: 'name', desc: false };
      const result = sortResults(mockData, sorting);

      // Check that complete structure is preserved
      expect(result).toEqual([
        { id: 2, name: 'Apple', value: 10 },
        { id: 1, name: 'Banana', value: 50 },
        { id: 3, name: 'Cherry', value: 5 },
      ]);
    });

    it('should sort by name in descending order', () => {
      const sorting: ColumnSort = { id: 'name', desc: true };
      const result = sortResults(mockData, sorting);

      // Check that complete structure is preserved
      expect(result).toEqual([
        { id: 3, name: 'Cherry', value: 5 },
        { id: 1, name: 'Banana', value: 50 },
        { id: 2, name: 'Apple', value: 10 },
      ]);
    });

    it('should sort by value in ascending order', () => {
      const sorting: ColumnSort = { id: 'value', desc: false };
      const result = sortResults(mockData, sorting);

      // Check that complete structure is preserved
      expect(result).toEqual([
        { id: 3, name: 'Cherry', value: 5 },
        { id: 2, name: 'Apple', value: 10 },
        { id: 1, name: 'Banana', value: 50 },
      ]);
    });

    it('should sort by value in descending order', () => {
      const sorting: ColumnSort = { id: 'value', desc: true };
      const result = sortResults(mockData, sorting);

      // Check that complete structure is preserved
      expect(result).toEqual([
        { id: 1, name: 'Banana', value: 50 },
        { id: 2, name: 'Apple', value: 10 },
        { id: 3, name: 'Cherry', value: 5 },
      ]);
    });

    it('should handle objects with missing properties', () => {
      const dataWithMissingProps = [
        { id: 1, name: 'Banana', value: 50 },
        { id: 2, value: 10 }, // missing name property
        { id: 3, name: 'Apple' }, // missing value property
      ];

      const sortingByName: ColumnSort = { id: 'name', desc: false };
      const nameResult = sortResults(dataWithMissingProps, sortingByName);

      expect(nameResult[0].id).toBe(2); // missing name should come first
      expect(nameResult[1].id).toBe(3);
      expect(nameResult[2].id).toBe(1);

      const sortingByValue: ColumnSort = { id: 'value', desc: false };
      const valueResult = sortResults(dataWithMissingProps, sortingByValue);

      expect(valueResult[0].id).toBe(3); // missing value should come first
      expect(valueResult[1].id).toBe(2);
      expect(valueResult[2].id).toBe(1);
    });

    it('should handle empty arrays', () => {
      const sorting: ColumnSort = { id: 'name', desc: false };
      const result = sortResults([], sorting);

      expect(result).toEqual([]);
    });

    it('should handle arrays with a single item', () => {
      const singleItem = [{ id: 1, name: 'Solo', value: 42 }];
      const sorting: ColumnSort = { id: 'name', desc: false };
      const result = sortResults(singleItem, sorting);

      expect(result).toEqual(singleItem);
      expect(result).not.toBe(singleItem); // Should still be a new array
    });
  });
});
