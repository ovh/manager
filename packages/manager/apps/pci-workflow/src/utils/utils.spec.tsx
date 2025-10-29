import { describe, expect, test } from 'vitest';

import { groupBy } from './index';

describe('Utility functions', () => {
  describe('Considering the groupBy function', () => {
    const array = [
      { id: 1, group: 'a' },
      { id: 2, group: 'b' },
      { id: 3, group: 'c' },
      { id: 4, group: 'b' },
      { id: 5, group: 'a' },
      { id: 6, group: 'a' },
    ];

    const valueMethod = (item: { id: number; group: string }) => item.group;

    const expected = new Map([
      [
        'a',
        [
          { id: 1, group: 'a' },
          { id: 5, group: 'a' },
          { id: 6, group: 'a' },
        ],
      ],
      [
        'b',
        [
          { id: 2, group: 'b' },
          { id: 4, group: 'b' },
        ],
      ],
      ['c', [{ id: 3, group: 'c' }]],
    ]);

    test(`Then, expect the output to be grouped by the group value`, () => {
      const result = groupBy(array, valueMethod);

      expect(result).toEqual(expected);
    });
  });
});
