import { describe, expect, it } from 'vitest';

import { safeJsonParse, safeJsonStringify } from './json';

describe('safeJsonParse', () => {
  it('should parse a valid JSON object string', () => {
    const json = '{"name":"test","value":123}';
    const result = safeJsonParse<{ name: string; value: number }>(json);
    expect(result).toEqual({ name: 'test', value: 123 });
  });

  it('should return an empty object for an empty string', () => {
    const json = '';
    const result = safeJsonParse<Record<string, unknown>>(json);
    expect(result).toEqual({});
  });

  it('should return an empty object for a malformed JSON string', () => {
    const json = '{invalid json}';
    const result = safeJsonParse<Record<string, unknown>>(json);
    expect(result).toEqual({});
  });

  it('should return an empty object for an unclosed JSON string', () => {
    const json = '{"unclosed":';
    const result = safeJsonParse<Record<string, unknown>>(json);
    expect(result).toEqual({});
  });
});

describe('safeJsonStringify', () => {
  it('should stringify a valid object', () => {
    const value = { name: 'test', value: 123 };
    const result = safeJsonStringify(value);
    expect(result).toBe('{"name":"test","value":123}');
  });

  it('should return an empty string for null', () => {
    const value = null;
    const result = safeJsonStringify(value);
    expect(result).toBe('');
  });

  it('should return an empty string for undefined', () => {
    const value = undefined;
    const result = safeJsonStringify(value);
    expect(result).toBe('');
  });

  it('should return an empty string for a circular reference', () => {
    const circular: { self?: unknown } = {};
    circular.self = circular;
    const result = safeJsonStringify(circular);
    expect(result).toBe('');
  });

  it('should return an empty string for a function', () => {
    const value = () => {
      return 'test';
    };
    const result = safeJsonStringify(value);
    expect(result).toBe('');
  });

  it('should return an empty string for a Symbol', () => {
    const value = Symbol('test');
    const result = safeJsonStringify(value);
    expect(result).toBe('');
  });

  it('should return an empty string for a BigInt', () => {
    const value = BigInt(123);
    const result = safeJsonStringify(value);
    expect(result).toBe('');
  });
});
