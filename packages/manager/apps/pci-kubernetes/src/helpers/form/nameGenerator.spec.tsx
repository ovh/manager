import { describe, vi } from 'vitest';

import { generateName, getRandomElementFromArray } from './nameGenerator';

describe('nameGenerator', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('generates a name', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const name = generateName();
    expect(name).toBe('charming-peebles');
  });
  it('generates a name with a prefix', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const name = generateName('prefix-');
    expect(name).toBe('prefix-charming-peebles');
  });
  it('should return undefined if array is empty', () => {
    const item = getRandomElementFromArray([]);
    expect(item).toBeUndefined();
  });
});
