import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { NodePoolPrice } from '@/api/data/kubernetes';
import {
  camelToSnake,
  compareFunction,
  filterSchemaKeys,
  formatIP,
  generateUniqueName,
  getColorByPercentage,
  getFormatedKubeVersion,
  isBase64,
  isIPValid,
  paginateResults,
  parseCommaSeparated,
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

  describe('getFormatedKubeVersion', () => {
    it.each([
      ['1.32.1-1', '1.32'],
      ['1.32', '1.32'],
      ['1.32.0', '1.32'],
      ['1.32.1', '1.32'],
      ['1', '1'],
    ])('retourne la version formatée pour %s', (version, expected) => {
      expect(getFormatedKubeVersion(version)).toBe(expected);
    });
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

describe('getColorByPercentage', () => {
  it('should return primary color for percentage <= 69', () => {
    expect(getColorByPercentage(50)).toBe('var(--ods-color-primary-500)');
    expect(getColorByPercentage(69)).toBe('var(--ods-color-primary-500)');
  });

  it('should return warning color for percentage between 70 and 79', () => {
    expect(getColorByPercentage(75)).toBe('var(--ods-color-warning-500)');
  });

  it('should return error color for percentage between 80 and 100', () => {
    expect(getColorByPercentage(85)).toBe('var(--ods-color-error-500)');
    expect(getColorByPercentage(100)).toBe('var(--ods-color-error-500)');
  });

  it('should return last color in thresholds if percentage exceeds 100', () => {
    expect(getColorByPercentage(120)).toBe('var(--ods-color-error-500)');
  });
});

describe('camelToSnake', () => {
  it('converts camelCase to snake_case', () => {
    expect(camelToSnake('camelCase')).toBe('camel_case');
    expect(camelToSnake('someLongVariableName')).toBe('some_long_variable_name');
    expect(camelToSnake('already_snake_case')).toBe('already_snake_case');
  });
});

describe('filterSchemaKeys', () => {
  it('filters out keys from schema based on exclude list', () => {
    const schema = z.object({
      key1: z.string(),
      key2: z.number(),
      key3: z.boolean(),
    });
    const result = filterSchemaKeys(schema, ['key2']);
    expect(result).toEqual(['key1', 'key3']);
  });

  it('returns all keys if exclude list is empty', () => {
    const schema = z.object({
      key1: z.string(),
      key2: z.number(),
    });
    const result = filterSchemaKeys(schema, []);
    expect(result).toEqual(['key1', 'key2']);
  });

  it('returns no keys if all are excluded', () => {
    const schema = z.object({
      key1: z.string(),
      key2: z.number(),
    });
    const result = filterSchemaKeys(schema, ['key1', 'key2']);
    expect(result).toEqual([]);
  });
});

describe('parseCommaSeparated', () => {
  it('parses a comma-separated string into an array', () => {
    expect(parseCommaSeparated('a,b,c')).toEqual(['a', 'b', 'c']);
  });

  it('trims spaces around values', () => {
    expect(parseCommaSeparated(' a , b , c ')).toEqual(['a', 'b', 'c']);
  });

  it('removes empty values', () => {
    expect(parseCommaSeparated('a,,b,c,,')).toEqual(['a', 'b', 'c']);
  });

  it('handles arrays directly', () => {
    expect(parseCommaSeparated(['a', ' b ', 'c'])).toEqual(['a', 'b', 'c']);
  });

  it('returns an empty array for undefined input', () => {
    expect(parseCommaSeparated(undefined)).toEqual([]);
  });
});

describe('isBase64', () => {
  it('validates a correct Base64 string', () => {
    expect(isBase64('SGVsbG8gd29ybGQ=')).toBe(true);
  });

  it('invalidates a non-Base64 string', () => {
    expect(isBase64('NotBase64')).toBe(false);
  });

  it('invalidates a malformed Base64 string', () => {
    expect(isBase64('SGVsbG8gd29ybGQ')).toBe(false);
  });
});

describe('generateUniqueName', () => {
  it.each([
    ['NodePool-2', [{ name: 'NodePool-1' }], 'NodePool-2'],
    ['NodePool-2', [{ name: 'NodePool-2' }], 'NodePool-2-1'],
    [
      'NodePool-2',
      [{ name: 'NodePool-2' }, { name: 'NodePool-2-1' }, { name: 'NodePool-2-2' }],
      'NodePool-2-3',
    ],
    ['UniquePool', [{ name: 'AnotherPool' }, { name: 'NodePool-2' }], 'UniquePool'],
  ])(
    'should return %s for baseName "%s" with existing nodes %j',
    (baseName, existingNodePools, expectedResult) => {
      const result = generateUniqueName(baseName, existingNodePools as NodePoolPrice[]);
      expect(result).toBe(expectedResult);
    },
  );
});
