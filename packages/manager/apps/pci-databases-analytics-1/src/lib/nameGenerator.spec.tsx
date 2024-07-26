import { describe, vi } from 'vitest';
import { generateName, getRandomElementFromArray } from '@/lib/nameGenerator';

describe('nameGenerator', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('generates a name', () => {
    global.Math.random = vi.fn(() => 0.5);
    const name = generateName();
    expect(name).toBe('curved-jensen');
  });
  it('generates a name with a prefix', () => {
    global.Math.random = vi.fn(() => 0.5);
    const name = generateName('prefix-');
    expect(name).toBe('prefix-curved-jensen');
  });
  it('should return undefined it array is empty', () => {
    const item = getRandomElementFromArray([]);
    expect(item).toBeUndefined();
  });
});
