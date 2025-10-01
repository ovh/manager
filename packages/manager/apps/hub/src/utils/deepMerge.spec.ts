import { describe, expect, it } from 'vitest';

import { deepMerge } from './deepMerge';

describe('deepMerge', () => {
  it('should merge flat objects', () => {
    const a = { name: 'Customer', numberReference: 3 };
    const b = { numberReference: 4 };
    const result = deepMerge(a, b);

    expect(result).toEqual({ name: 'Customer', numberReference: 4 });
  });

  it('should merge nested objects deeply', () => {
    const a = { user: { name: 'Customer', info: { numberReference: 3 } } };
    const b = { user: { info: { numberReference: 4 } } };
    const result = deepMerge(a, b);

    expect(result).toEqual({
      user: { name: 'Customer', info: { numberReference: 4 } },
    });
  });

  it('should replace arrays by default', () => {
    const a = { hobbies: ['swimming', 'sleeping'] };
    const b = { hobbies: ['fishing'] };
    const result = deepMerge(a, b);

    expect(result).toEqual({ hobbies: ['fishing'] });
  });

  it('should concat arrays when arrayMode is concat', () => {
    const a = { hobbies: ['swimming'] };
    const b = { hobbies: ['fishing'] };
    const result = deepMerge(a, b, { arrayMode: 'concat' });

    expect(result).toEqual({ hobbies: ['swimming', 'fishing'] });
  });

  it('should overwrite primitive values', () => {
    const a = { count: 1 };
    const b = { count: 42 };
    const result = deepMerge(a, b);

    expect(result).toEqual({ count: 42 });
  });

  it('should handle empty source', () => {
    const a = { name: 'Customer' };
    const result = deepMerge(a, {});

    expect(result).toEqual({ name: 'Customer' });
  });

  it('should handle empty target', () => {
    const b = { name: 'Customer' };
    const result = deepMerge({}, b);

    expect(result).toEqual({ name: 'Customer' });
  });
});
