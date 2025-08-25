import { describe, expect, it } from 'vitest';

import { ApiPathChoice } from '../types/api-types';
import {
  braceAwareBasePath,
  ensureLeadingSlash,
  normalizeApiPathChoices,
  normalizePath,
  normalizeSelectedApiPath,
  splitApiPathsByVersion,
  stripApiVersionPrefix,
} from './paths-utils';

// eslint-disable-next-line max-lines-per-function
describe('paths-utils', () => {
  describe('ensureLeadingSlash', () => {
    it('adds a slash if missing', () => {
      expect(ensureLeadingSlash('me')).toBe('/me');
    });
    it('keeps existing slash', () => {
      expect(ensureLeadingSlash('/cloud')).toBe('/cloud');
    });
    it('returns "/" for empty input', () => {
      expect(ensureLeadingSlash('   ')).toBe('/');
    });
  });

  describe('stripApiVersionPrefix', () => {
    it('removes "v6-/" prefix', () => {
      expect(stripApiVersionPrefix('v6-/foo')).toBe('/foo');
    });
    it('removes "/v2-/" prefix', () => {
      expect(stripApiVersionPrefix('/v2-/bar')).toBe('/bar');
    });
    it('ignores normal paths', () => {
      expect(stripApiVersionPrefix('/v2/users')).toBe('/v2/users');
    });
  });

  describe('braceAwareBasePath', () => {
    it('cuts suffix after first }', () => {
      expect(braceAwareBasePath('/project/{id}-get')).toBe('/project/{id}');
    });
    it('returns unchanged if no brace', () => {
      expect(braceAwareBasePath('/users/list')).toBe('/users/list');
    });
  });

  describe('normalizePath', () => {
    it('normalizes transport prefix', () => {
      expect(normalizePath('v6-/cloud')).toBe('/cloud');
    });
    it('keeps braces if braceAware=false', () => {
      expect(normalizePath('/x/{id}-get')).toBe('/x/{id}-get');
    });
    it('trims after } if braceAware=true', () => {
      expect(normalizePath('/x/{id}-get', { braceAware: true })).toBe('/x/{id}');
    });
  });

  describe('normalizeSelectedApiPath', () => {
    it('splits path-functionName form', () => {
      expect(normalizeSelectedApiPath('/v2/users/list-getUsers')).toEqual({
        version: 'v2',
        base: '/v2/users/list',
      });
    });
    it('handles brace-aware forms', () => {
      expect(normalizeSelectedApiPath('/cloud/project/{serviceName}-getProject')).toEqual({
        version: 'v6',
        base: '/cloud/project/{serviceName}',
      });
    });
    it('falls back to v6 if not v2', () => {
      expect(normalizeSelectedApiPath('/foo/bar')).toEqual({
        version: 'v6',
        base: '/foo/bar',
      });
    });
  });

  describe('splitApiPathsByVersion', () => {
    it('deduplicates normalized paths by version', () => {
      const input = ['/v2/users/list-get', '/v2/users/list-get', '/cloud/project/{id}-get'];
      const result = splitApiPathsByVersion(input);
      expect(result.v2).toEqual(['/v2/users/list']);
      expect(result.v6).toEqual(['/cloud/project/{id}']);
    });
  });

  describe('normalizeApiPathChoices', () => {
    it('normalizes string input', () => {
      const res = normalizeApiPathChoices(['/foo' as unknown as ApiPathChoice]);
      expect(res).toEqual([{ name: '/foo', value: '/foo' }]);
    });
    it('normalizes name/value objects', () => {
      const res = normalizeApiPathChoices([{ name: 'n', value: 'v' }]);
      expect(res).toEqual([{ name: 'n', value: 'v' }]);
    });
    it('normalizes separators', () => {
      const res = normalizeApiPathChoices([{ type: 'separator', line: '---' }]);
      expect(res).toEqual([{ name: '---', disabled: true }]);
    });
    it('stringifies unknown objects', () => {
      const res = normalizeApiPathChoices([{ foo: 'bar' } as unknown as ApiPathChoice]);
      expect(res).toEqual([{ name: '{"foo":"bar"}', value: '{"foo":"bar"}' }]);
    });
  });
});
