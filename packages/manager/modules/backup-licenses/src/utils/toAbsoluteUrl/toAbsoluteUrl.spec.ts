import { describe, expect, it } from 'vitest';

import { toAbsoluteUrl } from './toAbsoluteUrl';

describe('toAbsoluteUrl', () => {
  it('prefixes https:// when the url has no scheme', () => {
    expect(toAbsoluteUrl('vspc-adv.prod01.eu-west-rbx.backup.eu.ovhcloud.com')).toBe(
      'https://vspc-adv.prod01.eu-west-rbx.backup.eu.ovhcloud.com',
    );
  });

  it('leaves the url untouched when it already has a scheme', () => {
    expect(toAbsoluteUrl('https://vspc.example.com')).toBe('https://vspc.example.com');
  });

  it('leaves the url untouched when the scheme is not https', () => {
    expect(toAbsoluteUrl('http://vspc.example.com')).toBe('http://vspc.example.com');
  });

  it('returns undefined when the url is undefined', () => {
    expect(toAbsoluteUrl(undefined)).toBeUndefined();
  });

  it('returns undefined when the url is empty', () => {
    expect(toAbsoluteUrl('   ')).toBeUndefined();
  });
});
