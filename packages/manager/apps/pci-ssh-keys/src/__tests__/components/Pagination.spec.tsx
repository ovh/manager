import { describe, expect } from 'vitest';
import { getPageGroups } from '@/components/datagrid/pagination/Pagination';

describe('Pagination component with one page', () => {
  it('should returns 0 groups', () => {
    expect(getPageGroups(1, 0)).toEqual([]);
  });
});

describe('Pagination component with less than 7 pages', () => {
  it('should returns all pages', () => {
    expect(getPageGroups(2, 0)).toEqual([[0, 1]]);
    expect(getPageGroups(5, 0)).toEqual([[0, 1, 2, 3, 4]]);
    expect(getPageGroups(5, 4)).toEqual([[0, 1, 2, 3, 4]]);
    expect(getPageGroups(6, 0)).toEqual([[0, 1, 2, 3, 4, 5]]);
  });
});

describe('Pagination component with 7 pages or more', () => {
  it('returns first five pages group and last page group', () => {
    expect(getPageGroups(7, 2)).toEqual([[0, 1, 2, 3, 4], [6]]);
    expect(getPageGroups(10, 2)).toEqual([[0, 1, 2, 3, 4], [9]]);
    expect(getPageGroups(12, 3)).toEqual([[0, 1, 2, 3, 4], [11]]);
  });

  it('returns first page group, 3 page number groups (around current page) and last page group', () => {
    expect(getPageGroups(12, 7)).toEqual([[0], [6, 7, 8], [11]]);
  });

  it('returns first page group and last five pages group', () => {
    expect(getPageGroups(7, 6)).toEqual([[0], [2, 3, 4, 5, 6]]);
    expect(getPageGroups(12, 10)).toEqual([[0], [7, 8, 9, 10, 11]]);
  });
});
