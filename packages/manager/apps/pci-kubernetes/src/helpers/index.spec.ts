import { describe, it } from 'vitest';
import {
  compareFunction,
  formatIP,
  getFormatedKubeVersion,
  isIPValid,
  paginateResults,
} from '@/helpers/index';

describe('helper', () => {
  it('compares two objects based on a key', () => {
    const obj1 = { name: 'Alice' };
    const obj2 = { name: 'Bob' };
    const result = compareFunction('name')(obj1, obj2);
    expect(result).toBeLessThan(0);
  });

  it('paginates results correctly', () => {
    const items = Array.from({ length: 10 }, (_, i) => ({ id: i }));
    const pagination = { pageIndex: 1, pageSize: 5 };
    const result = paginateResults(items, pagination);
    expect(result.rows).toHaveLength(5);
    expect(result.pageCount).toBe(2);
    expect(result.totalRows).toBe(10);
  });

  it('formats Kubernetes version correctly', () => {
    const version = '1.18.10';
    const result = getFormatedKubeVersion(version);
    expect(result).toBe('1.18');
  });

  it('formats IP with default mask if not provided', () => {
    const ip = '192.168.1.1';
    const result = formatIP(ip);
    expect(result).toBe('192.168.1.1/32');
  });

  it('formats IP with provided mask', () => {
    const ip = '192.168.1.1/24';
    const result = formatIP(ip);
    expect(result).toBe('192.168.1.1/24');
  });

  it('validates correct IP without mask', () => {
    const ip = '192.168.1.1';
    const result = isIPValid(ip);
    expect(result).toBe(true);
  });

  it('validates correct IP with mask', () => {
    const ip = '192.168.1.1/24';
    const result = isIPValid(ip);
    expect(result).toBe(true);
  });

  it('invalidates incorrect IP', () => {
    const ip = '999.999.999.999';
    const result = isIPValid(ip);
    expect(result).toBe(false);
  });

  it('invalidates IP with incorrect mask', () => {
    const ip = '192.168.1.1/999';
    const result = isIPValid(ip);
    expect(result).toBe(false);
  });
});
