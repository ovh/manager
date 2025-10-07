import { buildQueryString } from './queryStrings';

describe('buildQueryString', () => {
  it('should return null for empty params', () => {
    expect(buildQueryString({})).toBeNull();
    expect(buildQueryString({ a: undefined })).toBeNull();
    expect(buildQueryString({ a: null })).toBeNull();
  });

  it('should handle falsy but valid values like empty string, 0, false', () => {
    const result = buildQueryString({ empty: '', zero: 0, no: false });
    const params = new URLSearchParams(result.substring(1));
    expect(params.get('empty')).toBe('');
    expect(params.get('zero')).toBe('0');
    expect(params.get('no')).toBe('false');
  });

  it('should ignore undefined and null values', () => {
    const result = buildQueryString({ a: undefined, b: null, c: 'ok' });
    expect(result).toBe('?c=ok');
  });

  it('should build query string with primitive values', () => {
    const result = buildQueryString({ a: 'x', b: 1, c: true });

    expect(result).toBe('?a=x&b=1&c=true');
  });

  it('should encode special characters', () => {
    const result = buildQueryString({
      q: 'a b&c=d',
      u: 'https://ex.com/?x=1&y=2',
    });
    expect(result).toBe(
      '?q=a+b%26c%3Dd&u=https%3A%2F%2Fex.com%2F%3Fx%3D1%26y%3D2',
    );
  });
});
