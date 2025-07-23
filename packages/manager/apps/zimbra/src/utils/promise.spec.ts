import { expect } from 'vitest';

import { allSettledSequential } from './promise';

describe('promise utils', () => {
  describe('allSettledSequential', () => {
    it('should execute all functions sequentially and collect results', async () => {
      const func1 = () => Promise.resolve(1);
      const func2 = () => Promise.resolve(2);
      const func3 = () => Promise.resolve(3);

      const result = await allSettledSequential([func1, func2, func3]);

      expect(result).toEqual([
        { status: 'fulfilled', value: 1 },
        { status: 'fulfilled', value: 2 },
        { status: 'fulfilled', value: 3 },
      ]);
    });

    it('should continue executing even if a function throws an error', async () => {
      const func1 = () => Promise.resolve(1);
      const func2 = () => Promise.reject(new Error('Test error'));
      const func3 = () => Promise.resolve(3);

      const result = await allSettledSequential([func1, func2, func3]);

      expect(result).toEqual([
        { status: 'fulfilled', value: 1 },
        { status: 'rejected', reason: new Error('Test error') },
        { status: 'fulfilled', value: 3 },
      ]);
    });

    it('should return an empty array when given an empty array', async () => {
      const result = await allSettledSequential([]);

      expect(result).toEqual([]);
    });
  });
});
