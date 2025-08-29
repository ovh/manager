import { describe, expect, it } from 'vitest';

import { readOptionalString } from './value-utils';

describe('readOptionalString', () => {
  it('returns string value when present', () => {
    const obj = { foo: 'bar' };
    expect(readOptionalString(obj, 'foo')).toBe('bar');
  });

  it('returns undefined when key does not exist', () => {
    const obj = { foo: 'bar' };
    expect(readOptionalString(obj, 'baz')).toBeUndefined();
  });

  it('returns undefined when value is not a string', () => {
    const obj = { num: 123, bool: true, obj: { nested: 'value' } };
    expect(readOptionalString(obj, 'num')).toBeUndefined();
    expect(readOptionalString(obj, 'bool')).toBeUndefined();
    expect(readOptionalString(obj, 'obj')).toBeUndefined();
  });

  it('returns empty string if value is explicitly an empty string', () => {
    const obj = { foo: '' };
    expect(readOptionalString(obj, 'foo')).toBe('');
  });

  it('returns undefined when value is null or undefined explicitly', () => {
    const obj = { a: null, b: undefined };
    expect(readOptionalString(obj, 'a')).toBeUndefined();
    expect(readOptionalString(obj, 'b')).toBeUndefined();
  });

  it('works with inherited properties too', () => {
    const proto = { foo: 'protoValue' } as const;
    const obj = Object.create(proto) as Record<string, unknown>;
    expect(readOptionalString(obj, 'foo')).toBe('protoValue');
  });
});
