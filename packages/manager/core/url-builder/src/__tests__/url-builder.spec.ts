import { describe, expect, it } from 'vitest';

import { buildURL, buildURLs } from '../url-builder.js';

describe('uniq URL generation', () => {
  it('should build simple URL', () => {
    expect(buildURL('http://localhost:1234/', '/', {})).toBe('http://localhost:1234/');
  });

  it('should build simple URL with no params', () => {
    expect(buildURL('http://localhost:1234/', '/', {})).toBe('http://localhost:1234/');
  });

  it('should build URL with simple hash', () => {
    expect(buildURL('http://localhost:1234/', '#/', {})).toBe('http://localhost:1234/#/');
  });

  it('should build URL with hash', () => {
    expect(buildURL('http://localhost:1234/', '#/path/a/b/c', {})).toBe(
      'http://localhost:1234/#/path/a/b/c',
    );
  });

  it('should resolve hash', () => {
    expect(buildURL('http://localhost:1234/#', '#/', {})).toBe('http://localhost:1234/#/');
  });
});

describe('Parameters', () => {
  it('should append parameter as query string', () => {
    expect(buildURL('http://localhost:1234/', '#/path/a/b/c', { foo: 'bar' })).toBe(
      'http://localhost:1234/#/path/a/b/c?foo=bar',
    );
  });

  it('should append multiple parameters as query string', () => {
    expect(
      buildURL('http://localhost:1234/', '#/path/a/b/c', {
        foo: 'bar',
        bar: 'baz',
      }),
    ).toBe('http://localhost:1234/#/path/a/b/c?foo=bar&bar=baz');
  });

  it('should replace named parameter in path (#/path/:foo/b/c)', () => {
    expect(buildURL('http://localhost:1234/', '#/path/:foo/b/c', { foo: 'bar' })).toBe(
      'http://localhost:1234/#/path/bar/b/c',
    );
  });

  it('should replace named parameter in path (#/path/:foo?bar=:bar)', () => {
    expect(
      buildURL('http://localhost:1234/', '#/path/:foo?bar=:bar', {
        foo: 'bar',
        bar: 'baz',
      }),
    ).toBe('http://localhost:1234/#/path/bar?bar=baz');
  });

  it('should replace named parameter in path (#/path/?foo=:foo&bar=:bar)', () => {
    expect(
      buildURL('http://localhost:1234/', '#/path/?foo=:foo&bar=:bar', {
        foo: 'bar',
        bar: 'baz',
      }),
    ).toBe('http://localhost:1234/#/path/?foo=bar&bar=baz');
  });

  it('should replace and append parameters', () => {
    expect(
      buildURL('http://localhost:1234/', '#/path/:foo/:bar/c', {
        foo: 'bar',
        bar: 'baz',
        baz: 'foo',
      }),
    ).toBe('http://localhost:1234/#/path/bar/baz/c?baz=foo');
  });

  it('should append querystring parameters', () => {
    expect(
      buildURL('http://localhost:1234/', '#/path/a/b/c?foo=bar', {
        bar: 'baz',
      }),
    ).toBe('http://localhost:1234/#/path/a/b/c?foo=bar&bar=baz');
  });
});

describe('multiple URLs generations', () => {
  it('should build multiples URLs with array input', () => {
    expect(
      buildURLs([
        { baseURL: 'http://localhost:1234/', path: '/', params: {} },
        {
          baseURL: 'http://localhost:1234/',
          path: '#/path/:foo?bar=:bar',
          params: { foo: 'foo', bar: 'bar' },
        },
      ]),
    ).toEqual(
      expect.arrayContaining([
        'http://localhost:1234/',
        'http://localhost:1234/#/path/foo?bar=bar',
      ]),
    );
  });

  it('should build multiples URLs with object input', () => {
    expect(
      buildURLs({
        first: { baseURL: 'http://localhost:1234/', path: '/', params: undefined },
        second: {
          baseURL: 'http://localhost:1234/',
          path: '#/path/:foo?bar=:bar',
          params: { foo: 'foo', bar: 'bar' },
        },
      }),
    ).toEqual(
      expect.objectContaining({
        first: 'http://localhost:1234/',
        second: 'http://localhost:1234/#/path/foo?bar=bar',
      }),
    );
  });
});
