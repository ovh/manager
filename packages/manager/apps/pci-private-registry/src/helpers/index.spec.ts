import { describe, it, expect } from 'vitest';
import { categorizeByKey, isCidr, isIp } from '.';
import { aggregateBySpecificKey } from './index';

type TestData = {
  id: number;
  name: string;
  tags: string[];
};

describe('categorizeByKey', () => {
  const testCases = [
    {
      description: 'categorizes items correctly based on a key and categories',
      data: [
        { id: 1, name: 'Item 1', tags: ['A', 'B'] },
        { id: 2, name: 'Item 2', tags: ['B', 'C'] },
        { id: 3, name: 'Item 3', tags: ['A'] },
      ],
      categories: ['A', 'B', 'C'],
      expected: {
        A: [
          { id: 1, name: 'Item 1' },
          { id: 3, name: 'Item 3' },
        ],
        B: [
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
        ],
        C: [{ id: 2, name: 'Item 2' }],
      },
    },
    {
      description: 'handles empty data array',
      data: [],
      categories: ['A', 'B', 'C'],
      expected: {
        A: [],
        B: [],
        C: [],
      },
    },
    {
      description: 'handles items with no matching categories',
      data: [
        { id: 1, name: 'Item 1', tags: ['D'] },
        { id: 2, name: 'Item 2', tags: ['E'] },
      ],
      categories: ['A', 'B', 'C'],
      expected: {
        A: [],
        B: [],
        C: [],
      },
    },
    {
      description: 'handles items with no array in the specified key',
      data: ([
        { id: 1, name: 'Item 1', tags: 'A' }, // Malformed, not an array
      ] as unknown) as TestData[],
      categories: ['A', 'B'],
      expected: {
        A: [],
        B: [],
      },
    },
    {
      description: 'handles items with mixed valid and invalid values',
      data: [
        { id: 1, name: 'Item 1', tags: ['A', 'X'] },
        { id: 2, name: 'Item 2', tags: ['B'] },
        { id: 3, name: 'Item 3', tags: [] },
      ],
      categories: ['A', 'B'],
      expected: {
        A: [{ id: 1, name: 'Item 1' }],
        B: [{ id: 2, name: 'Item 2' }],
      },
    },
  ];

  testCases.forEach(({ description, data, categories, expected }) => {
    it(description, () => {
      const result = categorizeByKey(data, 'tags', categories);
      expect(result).toEqual(expected);
    });
  });
});

describe('isCidr', () => {
  const testCases = [
    {
      input: '192.168.1.1/24',
      expected: true,
      description: 'Valid CIDR format',
    },
    {
      input: '255.255.255.255/32',
      expected: true,
      description: 'Max IP and CIDR range',
    },
    {
      input: '10.0.0.0/8',
      expected: true,
      description: 'Private network CIDR',
    },
    {
      input: '192.168.1.1/33',
      expected: false,
      description: 'Invalid CIDR range (too large)',
    },
    {
      input: '192.168.1.256/24',
      expected: false,
      description: 'Invalid IP address in CIDR',
    },
    { input: '192.168.1.1', expected: false, description: 'Missing CIDR part' },
    {
      input: 'invalid-string',
      expected: false,
      description: 'Completely invalid input',
    },
    { input: '', expected: false, description: 'Empty string' },
  ];

  testCases.forEach(({ input, expected, description }) => {
    it(`returns ${expected} for "${input}" (${description})`, () => {
      expect(isCidr(input)).toBe(expected);
    });
  });
});

describe('isIp', () => {
  const testCases = [
    { input: '192.168.1.1', expected: true, description: 'Valid IPv4 address' },
    {
      input: '255.255.255.255',
      expected: true,
      description: 'Broadcast IPv4 address',
    },
    { input: '0.0.0.0', expected: true, description: 'Default IPv4 address' },
    {
      input: '::1',
      expected: true,
      description: 'Valid IPv6 localhost address',
    },
    {
      input: '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
      expected: true,
      description: 'Valid IPv6 address',
    },
    {
      input: '192.168.1.256',
      expected: false,
      description: 'Invalid IPv4 address (out of range)',
    },
    {
      input: 'invalid-string',
      expected: false,
      description: 'Completely invalid input',
    },
    {
      input: '192.168.1',
      expected: false,
      description: 'Incomplete IPv4 address',
    },
    {
      input: '2001:db8:85a3::8a2e:370:7334::',
      expected: false,
      description: 'Invalid IPv6 address (too many colons)',
    },
    { input: '', expected: false, description: 'Empty string' },
  ];

  testCases.forEach(({ input, expected, description }) => {
    it(`returns ${expected} for "${input}" (${description})`, () => {
      expect(isIp(input)).toBe(expected);
    });
  });
});

describe('aggregateBySpecificKey', () => {
  it('should aggregate objects by a specified key and merge values from another key into an array', () => {
    const data = [
      { id: 1, category: 'fruit', name: 'apple' },
      { id: 2, category: 'fruit', name: 'banana' },
      { id: 3, category: 'vegetable', name: 'carrot' },
      { id: 4, category: 'fruit', name: 'apple' },
    ];

    const result = aggregateBySpecificKey(data, 'category', 'name');

    expect(result).toEqual([
      { id: 1, category: 'fruit', name: ['apple', 'banana'] },
      { id: 3, category: 'vegetable', name: ['carrot'] },
    ]);
  });

  it('should handle an empty input array', () => {
    const data: any[] = [];
    const result = aggregateBySpecificKey(data, 'category', 'name');
    expect(result).toEqual([]);
  });

  it('should handle data with no duplicates', () => {
    const data = [
      { id: 1, category: 'fruit', name: 'apple' },
      { id: 2, category: 'vegetable', name: 'carrot' },
    ];

    const result = aggregateBySpecificKey(data, 'category', 'name');

    expect(result).toEqual([
      { id: 1, category: 'fruit', name: ['apple'] },
      { id: 2, category: 'vegetable', name: ['carrot'] },
    ]);
  });

  it('should not duplicate values in the aggregated arrays', () => {
    const data = [
      { id: 1, category: 'fruit', name: 'apple' },
      { id: 2, category: 'fruit', name: 'apple' },
    ];

    const result = aggregateBySpecificKey(data, 'category', 'name');

    expect(result).toEqual([{ id: 1, category: 'fruit', name: ['apple'] }]);
  });
});
