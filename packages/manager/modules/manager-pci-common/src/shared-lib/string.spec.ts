import { describe, it } from 'vitest';
import { kebabToSnake } from '@/shared-lib/string';

describe('string', () => {
  it('should return snake case', () => {
    expect(kebabToSnake('a-b-c')).toBe('a_b_c');
  });

  it('should be in lower case', () => {
    expect(kebabToSnake('ABC')).toBe('abc');
  });
});
