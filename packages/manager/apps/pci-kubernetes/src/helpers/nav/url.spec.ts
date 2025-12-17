import { computeBreadcrumbUrl } from './url';

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
