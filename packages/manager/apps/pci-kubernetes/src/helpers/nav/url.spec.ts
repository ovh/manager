import { MockInstance, afterEach, describe, expect, it } from 'vitest';

import { computeBreadcrumbUrl, getProjectUrl } from './url';

describe('computeBreadcrumbUrl', () => {
  it('computes hrefs going back from current path', () => {
    const items = [{ label: 'my' }, { label: 'super' }, { label: 'awesome' }, { label: 'links' }];
    const result = computeBreadcrumbUrl(items, '/a/b/c/d');

    expect(result[0]?.href).toEqual('/a');
    expect(result[1]?.href).toEqual('/a/b');
    expect(result[2]?.href).toEqual('/a/b/c');
    expect(result[3]?.href).toEqual('/a/b/c/d');
  });

  it('keeps properties other than href', () => {
    const items = [{ label: 'another' }, { label: 'superb' }, { label: 'nav' }];
    const result = computeBreadcrumbUrl(items, '/a/b/c');

    expect(result[0]?.label).toEqual('another');
    expect(result[1]?.label).toEqual('superb');
    expect(result[2]?.label).toEqual('nav');
  });

  it('returns current path for a single item', () => {
    const items = [{ label: 'home' }];
    const result = computeBreadcrumbUrl(items, '/root/page');

    expect(result).toEqual([{ label: 'home', href: '/root/page' }]);
  });
});

describe('getProjectUrl', () => {
  let baseURIspy: MockInstance<() => string>;
  afterEach(() => {
    baseURIspy?.mockRestore();
  });

  describe.each([
    {
      description: 'extracts project URL from valid baseURI',
      baseURI: 'https://example.com/path/to/some/projects/project123/settings',
      expected: 'https://example.com/path/to/some/projects/project123',
    },
    {
      description: 'handles URLs with query parameters',
      baseURI: 'https://example.com/projects/proj123/page?param=value&other=123',
      expected: 'https://example.com/projects/proj123',
    },
    {
      description: 'handles URLs with fragments',
      baseURI: 'https://example.com/projects/proj123/section#top',
      expected: 'https://example.com/projects/proj123',
    },
    {
      description: 'handles localhost URLs',
      baseURI: 'http://localhost:3000/projects/projects/project456',
      expected: 'http://localhost:3000/projects/projects/project456',
    },
    {
      description: 'returns null when baseURI does not match the project URL pattern',
      baseURI: 'https://example.com/app/dashboard',
      expected: null,
    },
    {
      description: 'returns null for empty baseURI',
      baseURI: '',
      expected: null,
    },
    {
      description: 'returns null when projects path has no ID',
      baseURI: 'https://example.com/projects/',
      expected: null,
    },
  ])('$description', ({ baseURI, expected }) => {
    it(`should return "${expected}"`, () => {
      baseURIspy = vi.spyOn(document, 'baseURI', 'get').mockReturnValue(baseURI);

      const result = getProjectUrl();

      expect(result).toBe(expected);
    });
  });
});
