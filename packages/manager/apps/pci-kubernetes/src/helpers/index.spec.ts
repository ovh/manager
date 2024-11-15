import { describe, it, vi } from 'vitest';
import { z } from 'zod';
import {
  compareFunction,
  formatIP,
  getFormatedKubeVersion,
  isIPValid,
  paginateResults,
  validateSchema,
  formatBytes,
  getColorByPercentage,
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

describe('validateSchema', () => {
  const schema = z.object({
    name: z.string(),
    age: z
      .number()
      .int()
      .positive(),
  });

  it('should return validated data if data is valid', () => {
    const data = { name: 'John', age: 30 };
    const result = validateSchema({ schema, data });
    expect(result).toEqual(data);
  });

  it('should return null and call onInvalid if data is invalid', () => {
    const data = { name: 'John', age: -5 };
    const onInvalidMock = vi.fn();
    const result = validateSchema({ schema, data, onInvalid: onInvalidMock });

    expect(result).toBeNull();
    expect(onInvalidMock).toHaveBeenCalledTimes(1);
    expect(onInvalidMock.mock.calls[0][0]).toBeInstanceOf(z.ZodError);
  });

  it('should return null without calling onInvalid if data is invalid and onInvalid is not provided', () => {
    const data = { name: 'John', age: -5 };
    const result = validateSchema({ schema, data });
    expect(result).toBeNull();
  });
});

describe('formatBytes', () => {
  it('should format bytes correctly for values under 1024', () => {
    expect(formatBytes(512)).toBe('512 o');
  });

  it('should format bytes correctly in KiB', () => {
    expect(formatBytes(2048)).toBe('2 KiB');
  });

  it('should format bytes correctly in MiB', () => {
    expect(formatBytes(1048576)).toBe('1 MiB');
  });

  it('should format bytes correctly in GiB', () => {
    expect(formatBytes(1073741824)).toBe('1 GiB');
  });

  it('should format bytes correctly in TiB', () => {
    expect(formatBytes(1099511627776)).toBe('1 TiB');
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
