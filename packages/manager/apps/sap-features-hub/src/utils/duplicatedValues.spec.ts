import { describe, expect, test } from 'vitest';
import { hasDuplicatedValues } from './duplicatedValues';

describe('hasDuplicateValues test suite', () => {
  test.each([
    [[], false],
    [[''], false],
    [['', ''], false],
    [[null], false],
    [[null, null, null], false],
    [[undefined], false],
    [[undefined, undefined, undefined], false],
    [['a'], false],
    [['a', 'a', 'a'], true],
    [['a', 'b'], false],
    [['a', 'a', 'b'], true],
  ])('should evaluate duplicates presence in %s as: %s', (input, expected) => {
    expect(hasDuplicatedValues(input)).toBe(expected);
  });
});
