import { describe, expect, test } from 'vitest';
import { calculateQuantityValue, normalizeQuantity } from '../quantityUtils';

describe('quantityUtils', () => {
  describe('calculateQuantityValue', () => {
    test('should return NaN when inputValue is NaN', () => {
      expect(Number.isNaN(calculateQuantityValue(10, Number.NaN))).toBe(true);
    });

    test.each([
      { quota: 0, input: 5, expected: 0, desc: 'quota is 0' },
      { quota: 10, input: 5, expected: 5, desc: 'input < quota' },
      { quota: 10, input: 15, expected: 15, desc: 'input > quota' },
      { quota: 10, input: 10, expected: 10, desc: 'input equals quota' },
    ])('should return $expected when $desc', ({ quota, input, expected }) => {
      expect(calculateQuantityValue(quota, input)).toBe(expected);
    });
  });

  describe('normalizeQuantity', () => {
    test.each([
      {
        quota: 10,
        quantity: 15,
        min: 1,
        expected: 10,
        desc: 'quantity > quota',
      },
      { quota: 10, quantity: 0.5, min: 1, expected: 1, desc: 'quantity < min' },
      { quota: 10, quantity: 0, min: 1, expected: 1, desc: 'quantity is 0' },
      {
        quota: 10,
        quantity: 5,
        min: 1,
        expected: 5,
        desc: 'quantity within range',
      },
      {
        quota: 10,
        quantity: 10,
        min: 1,
        expected: 10,
        desc: 'quantity equals quota',
      },
      {
        quota: 10,
        quantity: 1,
        min: 1,
        expected: 1,
        desc: 'quantity equals min',
      },
    ])(
      'should return $expected when $desc',
      ({ quota, quantity, min, expected }) => {
        expect(normalizeQuantity(quota, quantity, min)).toBe(expected);
      },
    );
  });
});
