import { describe, it, expect } from 'vitest';
import { categorizeByKey } from '.';

import { aggregateBySpecificKey, generateUniqueString } from './index';

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

describe('generateUniqueString', () => {
  const testCases = [
    {
      description: 'handles an array with multiple objects',
      input: [
        { type: 'animal', name: 'dog', age: 3 },
        { type: 'animal', name: 'cat', age: 2 },
        { type: 'plant', name: 'rose', age: 1 },
        { type: 'animal', name: 'bird', age: 1 },
      ],
      expectedBase64:
        'eyJ0eXBlIjoiYW5pbWFsIiwibmFtZSI6ImJpcmQiLCJhZ2UiOjF9fHsidHlwZSI6ImFuaW1hbCIsIm5hbWUiOiJjYXQiLCJhZ2UiOjJ9fHsidHlwZSI6ImFuaW1hbCIsIm5hbWUiOiJkb2ciLCJhZ2UiOjN9fHsidHlwZSI6InBsYW50IiwibmFtZSI6InJvc2UiLCJhZ2UiOjF9',
    },
    {
      description: 'handles an array with a single object',
      input: [{ type: 'animal', name: 'fox', age: 4 }],
      expectedBase64: 'eyJ0eXBlIjoiYW5pbWFsIiwibmFtZSI6ImZveCIsImFnZSI6NH0=',
    },
    {
      description: 'handles an empty array',
      input: [],
      expectedBase64: '',
    },
    {
      description: 'handles objects with additional properties',
      input: [
        { type: 'vehicle', name: 'car', speed: 120 },
        { type: 'vehicle', name: 'bike', speed: 30 },
      ],
      expectedBase64:
        'eyJ0eXBlIjoidmVoaWNsZSIsIm5hbWUiOiJiaWtlIiwic3BlZWQiOjMwfXx7InR5cGUiOiJ2ZWhpY2xlIiwibmFtZSI6ImNhciIsInNwZWVkIjoxMjB9',
    },
  ];

  it.each(testCases)('$description', ({ input, expectedBase64 }) => {
    const result = generateUniqueString<
      | {
          type: string;
          age: number;
          name: string;
        }
      | {
          type: string;
          name: string;
          speed: number;
        }
    >(input);
    expect(result).toBe(expectedBase64);
  });
});
