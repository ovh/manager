import { describe, it, expect, vi } from 'vitest';
import { getRandomElementFromArray, generateName } from './nameGenerator';

describe('getRandomElementFromArray', () => {
  it('should return undefined for empty array', () => {
    expect(getRandomElementFromArray([])).toBeUndefined();
  });

  it('should return the only element for array of length 1', () => {
    expect(getRandomElementFromArray(['unique'])).toBe('unique');
  });

  it('should return an element from the array', () => {
    const arr = ['a', 'b', 'c'];
    const result = getRandomElementFromArray(arr);
    expect(arr).toContain(result);
  });

  it('should be random (simulate Math.random)', () => {
    const arr = ['x', 'y', 'z'];
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(getRandomElementFromArray(arr)).toBe(arr[1]);
    vi.restoreAllMocks();
  });
});

describe('generateName', () => {
  it('should generate different names on multiple calls', () => {
    const name1 = generateName();
    const name2 = generateName();
    expect(name1).not.toBe(name2);
  });
});
