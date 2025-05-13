import { describe, expect, it } from 'vitest';
import { TArchiveContainer } from '@/api/data/archive';
import { paginateResults, sortResults } from './index';

describe('paginateResults', () => {
  it('returns correct pagination data for given items and pagination state', () => {
    const items = Array.from({ length: 50 }, (_, i) => ({ id: i }));
    const pagination = { pageIndex: 1, pageSize: 10 };
    const result = paginateResults(items, pagination);
    expect(result.rows).toHaveLength(10);
    expect(result.pageCount).toBe(5);
    expect(result.totalRows).toBe(50);
  });

  it('returns empty rows for out of range pageIndex', () => {
    const items = Array.from({ length: 50 }, (_, i) => ({ id: i }));
    const pagination = { pageIndex: 10, pageSize: 10 };
    const result = paginateResults(items, pagination);
    expect(result.rows).toHaveLength(0);
    expect(result.pageCount).toBe(5);
    expect(result.totalRows).toBe(50);
  });
});

describe('sortResults', () => {
  const items = [
    { name: 'name1', ownerId: 1 },
    { name: 'name2', ownerId: 2 },
  ] as TArchiveContainer[];

  it('sorts items by given column in ascending order', () => {
    const sorting = { id: 'id', desc: false };
    const result = sortResults<TArchiveContainer>(items, sorting);
    expect(result[0].name).toBe('name1');
    expect(result[1].name).toBe('name2');
  });

  it('sorts items by given column in descending order', () => {
    const sorting = { id: 'id', desc: true };
    const result = sortResults(items, sorting);
    expect(result[0].name).toBe('name2');
    expect(result[1].name).toBe('name1');
  });

  it('returns unsorted items for unsupported column', () => {
    const sorting = { id: 'unsupported', desc: false };
    const result = sortResults(items, sorting);
    expect(result[0].name).toBe('name1');
    expect(result[1].name).toBe('name2');
  });
});
