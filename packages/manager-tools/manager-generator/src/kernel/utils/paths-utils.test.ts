import { describe, expect, it } from 'vitest';

import {
  braceAwareBasePath,
  ensureLeadingSlash,
  normalizePath,
  normalizeSelectedApiPath,
  splitApiPathsByVersion,
  stripApiVersionPrefix,
} from './paths-utils';

// eslint-disable-next-line max-lines-per-function
describe('paths-utils', () => {
  describe('ensureLeadingSlash', () => {
    it('adds slash when missing', () => {
      expect(ensureLeadingSlash('me')).toBe('/me');
    });
    it('keeps existing slash', () => {
      expect(ensureLeadingSlash('/x')).toBe('/x');
    });
    it('normalizes empty/whitespace', () => {
      expect(ensureLeadingSlash('')).toBe('/');
      expect(ensureLeadingSlash('   ')).toBe('/');
    });
  });

  describe('stripApiVersionPrefix', () => {
    it('removes vN-/ prefix', () => {
      expect(stripApiVersionPrefix('v6-/ovhCloudConnect')).toBe('/ovhCloudConnect');
      expect(stripApiVersionPrefix('/v2-/users')).toBe('/users');
    });
    it('leaves normal paths alone', () => {
      expect(stripApiVersionPrefix('/v2/users')).toBe('/v2/users');
      expect(stripApiVersionPrefix('foo')).toBe('foo');
    });
  });

  describe('braceAwareBasePath', () => {
    it('cuts after first } when suffix exists', () => {
      expect(braceAwareBasePath('/cloud/{id}-get')).toBe('/cloud/{id}');
    });
    it('returns unchanged if no brace', () => {
      expect(braceAwareBasePath('/users/list')).toBe('/users/list');
    });
    it('handles just parameter', () => {
      expect(braceAwareBasePath('/{id}')).toBe('/{id}');
    });
  });

  describe('normalizePath', () => {
    it('strips version prefix then ensures slash', () => {
      expect(normalizePath('v6-/foo')).toBe('/foo');
    });
    it('applies braceAware option', () => {
      expect(normalizePath('/x/{id}-extra', { braceAware: true })).toBe('/x/{id}');
    });
  });

  describe('normalizeSelectedApiPath', () => {
    it('splits path-functionName form', () => {
      const result = normalizeSelectedApiPath('/v2/users/list-getUsers');
      expect(result).toEqual({ version: 'v2', base: '/v2/users/list' });
    });
    it('handles brace-aware trimming', () => {
      const result = normalizeSelectedApiPath('/cloud/project/{serviceName}-getProject');
      expect(result).toEqual({ version: 'v6', base: '/cloud/project/{serviceName}' });
    });
    it('detects v2 when raw starts with v2-/', () => {
      const result = normalizeSelectedApiPath('v2-/foo-getBar');
      expect(result.version).toBe('v2');
    });
  });

  describe('splitApiPathsByVersion', () => {
    it('splits and deduplicates', () => {
      const out = splitApiPathsByVersion([
        '/v2/users/list-getUsers',
        '/v2/users/list-getUsers',
        '/cloud/project/{id}-get',
      ]);
      expect(out.v2).toEqual(['/v2/users/list']);
      expect(out.v6).toEqual(['/cloud/project/{id}']);
    });
  });
});
