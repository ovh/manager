import { describe, it, expect } from 'vitest';
import { categorizeByKey } from '.';

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
