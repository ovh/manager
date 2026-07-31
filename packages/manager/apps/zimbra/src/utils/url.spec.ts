import { describe, expect, it } from 'vitest';

import { isPlatformLessPathname } from './url';

const platformId = '00000000-0000-0000-0000-000000000001';

describe('isPlatformLessPathname', () => {
  it.each([
    '/services',
    '/domains',
    '/email_accounts',
    '/organizations',
    '/mailing_lists',
    '/redirections',
    '/auto_replies',
  ])('detects the platform scoped entry point %s', (pathname) => {
    expect(isPlatformLessPathname(pathname)).toBe(true);
  });

  it('keeps deeper platform less paths', () => {
    expect(isPlatformLessPathname('/email_accounts/add')).toBe(true);
  });

  it('ignores a path already scoped to a platform', () => {
    expect(isPlatformLessPathname(`/${platformId}/services`)).toBe(false);
  });

  it('ignores the platform dashboard', () => {
    expect(isPlatformLessPathname(`/${platformId}`)).toBe(false);
  });

  it('ignores the root path', () => {
    expect(isPlatformLessPathname('/')).toBe(false);
  });

  it('ignores onboarding routes', () => {
    expect(isPlatformLessPathname('/onboarding')).toBe(false);
    expect(isPlatformLessPathname('/onboarding/welcome')).toBe(false);
  });

  it('ignores an unknown entry point', () => {
    expect(isPlatformLessPathname('/unknown_section')).toBe(false);
  });
});
