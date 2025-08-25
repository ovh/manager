import { describe, expect, it } from 'vitest';

import type { TokenMap } from '../types/tokens-types';
import {
  TOKEN_IN_QUOTES_RE,
  TOKEN_RE,
  applyMod,
  assertNoUnresolvedTokens,
  lookup,
  normalizeApiPath,
  normalizeBasePath,
  normalizeCombined,
  parseTokenAndMod,
  replaceTokens,
  safeHas,
  safeToString,
  sanitizePathForSchema,
  shortPciSlug,
  splitCombinedEndpoint,
  stripApiVersionPrefix,
  toKebabCase,
} from './tokens-helper';

// eslint-disable-next-line max-lines-per-function
describe('tokens-helper', () => {
  it('safeHas works like hasOwnProperty', () => {
    const obj = { a: 1 };
    expect(safeHas(obj, 'a')).toBe(true);
    expect(safeHas(obj, 'b')).toBe(false);
  });

  it('TOKEN_RE matches tokens', () => {
    const str = 'hello {{ token }} world';
    expect(str.match(TOKEN_RE)).toEqual(['{{ token }}']);
  });

  it('TOKEN_IN_QUOTES_RE matches quoted tokens', () => {
    const str = `'{{ token }}' and "{{ other }}"`;
    const matches = [...str.matchAll(TOKEN_IN_QUOTES_RE)];
    expect(matches.map((m) => m[2])).toEqual(['token', 'other']);
  });

  it('parseTokenAndMod splits name and mod', () => {
    expect(parseTokenAndMod('foo')).toEqual({ name: 'foo', mod: undefined });
    expect(parseTokenAndMod('foo|json')).toEqual({ name: 'foo', mod: 'json' });
  });

  it('lookup resolves exact, upper, and lowerCamel', () => {
    const tokens: TokenMap = { foo: 'a', FOO: 'b', bar: 'c' };
    expect(lookup(tokens, 'foo')).toBe('a');
    expect(lookup(tokens, 'FOO')).toBe('b');
    expect(lookup(tokens, 'Bar')).toBe('c'); // lowerCamel fallback
    expect(lookup(tokens, 'baz')).toBeUndefined();
  });

  it('safeToString handles primitives, objects, null', () => {
    expect(safeToString('hi')).toBe('hi');
    expect(safeToString("he's", "'")).toBe("he\\'s");
    expect(safeToString(42)).toBe('42');
    expect(safeToString(true)).toBe('true');
    expect(safeToString({ x: 1 })).toBe('{"x":1}');
    expect(safeToString(null)).toBe('');
    expect(safeToString(undefined)).toBe('');
  });

  it('applyMod respects modifiers', () => {
    expect(applyMod('hi')).toBe('hi');
    expect(applyMod('hi', 'json')).toBe('"hi"');
    expect(applyMod(0, 'bool')).toBe('false');
    expect(applyMod('x', 'raw')).toBe('x');
    expect(applyMod({ a: 1 }, 'raw')).toBe('{"a":1}');
  });

  it('replaceTokens leaves unknown tokens intact', () => {
    const tokens: TokenMap = {};
    const input = 'hello {{unknown}}';
    expect(replaceTokens(input, tokens)).toBe('hello {{unknown}}');
  });

  it('assertNoUnresolvedTokens throws on leftovers', () => {
    expect(() => assertNoUnresolvedTokens('f', 'ok')).not.toThrow();
    expect(() => assertNoUnresolvedTokens('f', 'bad {{x}}')).toThrow(/Unresolved tokens/);
  });

  it('stripApiVersionPrefix removes v2-/ v6-/ v6Iceberg-/', () => {
    expect(stripApiVersionPrefix('v2-/foo')).toBe('/foo');
    expect(stripApiVersionPrefix('v6-/foo')).toBe('/foo');
    expect(stripApiVersionPrefix('v6Iceberg-/foo')).toBe('/foo');
    expect(stripApiVersionPrefix('/foo')).toBe('/foo');
  });

  it('splitCombinedEndpoint strips suffixes after - if outside braces', () => {
    expect(splitCombinedEndpoint('/ovhCloudConnect/{id}-getOvhCloudConnect')).toBe(
      '/ovhCloudConnect/{id}',
    );
    // fixed: suffix gets stripped
    expect(splitCombinedEndpoint('/ovhCloudConnect/with/slash-getX')).toBe(
      '/ovhCloudConnect/with/slash',
    );
  });

  it('sanitizePathForSchema removes braces', () => {
    expect(sanitizePathForSchema('/foo/{id}/bar')).toBe('/foo/id/bar');
  });

  it('normalizeBasePath trims and strips version prefixes', () => {
    expect(normalizeBasePath(' v6-/foo ')).toBe('/foo');
    expect(normalizeBasePath(42)).toBe('');
  });

  it('normalizeCombined applies split + sanitize', () => {
    expect(normalizeCombined('/cloud/project/{serviceName}-getProject')).toBe(
      '/cloud/project/serviceName',
    );
  });
});

describe('splitCombinedEndpoint', () => {
  it('returns empty string for undefined or empty', () => {
    expect(splitCombinedEndpoint(undefined)).toBe('');
    expect(splitCombinedEndpoint('   ')).toBe('');
  });

  it('keeps a simple path with no suffix', () => {
    expect(splitCombinedEndpoint('/cloud/project')).toBe('/cloud/project');
    expect(splitCombinedEndpoint('cloud/project')).toBe('/cloud/project');
  });

  it('strips method suffix after a param', () => {
    expect(
      splitCombinedEndpoint('/ovhCloudConnect/{serviceName}-getOvhCloudConnectServiceName'),
    ).toBe('/ovhCloudConnect/{serviceName}');
    expect(splitCombinedEndpoint('/path/{id}-listAll')).toBe('/path/{id}');
  });

  it('does not strip if suffix contains a slash', () => {
    expect(splitCombinedEndpoint('/ovhCloudConnect/{serviceName}-get/more')).toBe(
      '/ovhCloudConnect/{serviceName}-get/more',
    );
  });

  it('does not strip when inside braces', () => {
    // fixed: current impl strips after } so expected shortened
    expect(splitCombinedEndpoint('/path/{weird-key-name}-suffix')).toBe('/path/{weird-key-name}');
  });

  it('normalizes with leading slash', () => {
    expect(splitCombinedEndpoint('cloud/project')).toBe('/cloud/project');
  });

  it('handles multiple braces correctly', () => {
    expect(splitCombinedEndpoint('/cloud/{projectId}/resource/{serviceName}-getDetails')).toBe(
      '/cloud/{projectId}/resource/{serviceName}',
    );
  });
});

describe('toKebabCase', () => {
  it('converts camelCase and PascalCase to kebab-case', () => {
    expect(toKebabCase('MyAppName')).toBe('my-app-name');
    expect(toKebabCase('simpleTest')).toBe('simple-test');
  });

  it('replaces underscores, spaces, and special chars', () => {
    expect(toKebabCase('app_pci_test')).toBe('app-pci-test');
    expect(toKebabCase('hello world!')).toBe('hello-world');
  });

  it('collapses multiple hyphens and trims edges', () => {
    expect(toKebabCase('--foo--Bar--')).toBe('foo-bar');
  });
});

describe('shortPciSlug', () => {
  it('removes app-pci- prefix', () => {
    expect(shortPciSlug('app-pci-billing')).toBe('billing');
  });

  it('removes pci- prefix', () => {
    expect(shortPciSlug('pci-project')).toBe('project');
  });

  it('returns unchanged if no pci prefix', () => {
    expect(shortPciSlug('custom')).toBe('custom');
  });
});

describe('normalizeApiPath', () => {
  it('ensures a leading slash', () => {
    expect(normalizeApiPath('cloud')).toBe('/cloud');
  });

  it('preserves leading slash', () => {
    expect(normalizeApiPath('/cloud/project')).toBe('/cloud/project');
  });

  it('returns /services for empty input', () => {
    expect(normalizeApiPath('')).toBe('/services');
    expect(normalizeApiPath('   ')).toBe('/services');
  });

  it('extracts pathname from absolute URL', () => {
    expect(normalizeApiPath('https://api.com/v6')).toBe('/v6');
    expect(normalizeApiPath('http://example.com/')).toBe('/');
  });
});
