import { describe, expect, it, vi } from 'vitest';
import { paginateResults, sortResults } from './index';
import { TLoadBalancer } from '@/api/data/load-balancer';

vi.unmock('@/helpers');

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
  const items: TLoadBalancer[] = [
    { id: 'lb1', region: 'region1' },
    { id: 'lb2', region: 'region2' },
  ] as TLoadBalancer[];

  it('sorts items by given column in ascending order', () => {
    const sorting = { id: 'id', desc: false };
    const result = sortResults<TLoadBalancer>(items, sorting);
    expect(result[0].id).toBe('lb1');
    expect(result[1].id).toBe('lb2');
  });

  it('sorts items by given column in descending order', () => {
    const sorting = { id: 'id', desc: true };
    const result = sortResults(items, sorting);
    expect(result[0].id).toBe('lb2');
    expect(result[1].id).toBe('lb1');
  });

  it('returns unsorted items for unsupported column', () => {
    const sorting = { id: 'unsupported', desc: false };
    const result = sortResults(items, sorting);
    expect(result[0].id).toBe('lb1');
    expect(result[1].id).toBe('lb2');
  });
});
