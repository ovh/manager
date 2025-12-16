import { computeBreadcrumbUrl } from './url';

describe('computeBreadcrumbUrl', () => {
  it('computes hrefs going back from current path', () => {
    const items = [{ label: 'a' }, { label: 'b' }, { label: 'c' }, { label: 'd' }];
    const result = computeBreadcrumbUrl(items, '/a/b/c/d');

    expect(result[0]?.href).toEqual('/a');
    expect(result[1]?.href).toEqual('/a/b');
    expect(result[2]?.href).toEqual('/a/b/c');
    expect(result[3]?.href).toEqual('/a/b/c/d');
  });

  it('keeps properties other than href', () => {
    const items = [{ label: 'a' }, { label: 'b' }, { label: 'c' }];
    const result = computeBreadcrumbUrl(items, '/a/b/c');

    expect(result[0]?.label).toEqual('a');
    expect(result[1]?.label).toEqual('b');
    expect(result[2]?.label).toEqual('c');
  });

  it('returns current path for a single item', () => {
    const items = [{ label: 'root' }];
    const result = computeBreadcrumbUrl(items, '/root/page');

    expect(result).toEqual([{ label: 'root', href: '/root/page' }]);
  });
});
