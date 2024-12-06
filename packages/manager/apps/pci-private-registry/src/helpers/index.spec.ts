import { describe, it, expect } from 'vitest';
import { aggregateBySpecificKey, isCidr } from '.';

describe('aggregateBySpecificKey', () => {
  it('should aggregate objects by a specific key and merge values into an array', () => {
    const inputData = [
      { id: 1, type: 'x', description: 'desc1' },
      { id: 2, type: 'x', description: 'desc2' },
      { id: 1, type: 'y', description: 'desc3' },
      { id: 2, type: 'y', description: 'desc4' },
      { id: 1, type: 'x', description: 'desc5' },
    ];

    const result = aggregateBySpecificKey(inputData, 'id', 'type');

    expect(result).toEqual([
      {
        id: 1,
        type: ['x', 'y'],
        description: 'desc1',
      },
      {
        id: 2,
        type: ['x', 'y'],
        description: 'desc2',
      },
    ]);
  });

  it('should return a single value if only one occurrence of a key is found', () => {
    const inputData = [
      { id: 1, type: 'x', description: 'desc1' },
      { id: 2, type: 'x', description: 'desc2' },
    ];

    const result = aggregateBySpecificKey(inputData, 'id', 'type');

    expect(result).toEqual([
      {
        id: 1,
        type: 'x',
        description: 'desc1',
      },
      {
        id: 2,
        type: 'x',
        description: 'desc2',
      },
    ]);
  });

  it('should handle empty input data correctly', () => {
    const inputData: { id: number; type: string; description: string }[] = [];

    const result = aggregateBySpecificKey(inputData, 'id', 'type');

    expect(result).toEqual([]);
  });
});

describe('isCidr', () => {
  it('should return true for a valid CIDR', () => {
    expect(isCidr('192.168.1.0/24')).toBe(true);
    expect(isCidr('10.0.0.0/8')).toBe(true);
    expect(isCidr('172.16.0.0/12')).toBe(true);
  });

  it('should return false for an invalid CIDR', () => {
    expect(isCidr('192.168.1.0/33')).toBe(false); // Invalid subnet
    expect(isCidr('256.0.0.0/24')).toBe(false); // Invalid IP
    expect(isCidr('192.168.1/24')).toBe(false); // Missing octet
    expect(isCidr('192.168.1.0')).toBe(false); // Missing CIDR suffix
  });

  it('should return false for non-CIDR strings', () => {
    expect(isCidr('Hello World')).toBe(false);
    expect(isCidr('')).toBe(false);
    expect(isCidr('192.168.1.0/abc')).toBe(false); // Invalid suffix
  });
});
