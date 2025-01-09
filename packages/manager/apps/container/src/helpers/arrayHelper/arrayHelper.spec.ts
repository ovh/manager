import { describe, expect, it } from 'vitest';
import { groupBy } from '@/helpers';

describe('collectionHelper', () => {
  describe('groupBy', () => {
    it('should group array by key', () => {
      const array = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Bob' },
      ];
      const result = groupBy(array, (item) => item.id);
      expect(result).toEqual({
        1: [{ id: 1, name: 'John' }],
        2: [{ id: 2, name: 'Jane' }],
        3: [{ id: 3, name: 'Bob' }],
      });

      const array2 = [6.1, 4.2, 6.3];
      const result2 = groupBy(array2, Math.floor);
      expect(result2).toEqual({
        4: [4.2],
        6: [6.1, 6.3],
      });
    });
  });
});
