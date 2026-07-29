import { describe, expect, it } from 'vitest';

import { EMPTY_VALUE_PLACEHOLDER } from '@/module.constants';

import { firstIpWithoutMask, formatIpList } from './formatIpList';

describe('formatIpList', () => {
  it('returns the placeholder when the list is missing', () => {
    expect(formatIpList()).toBe(EMPTY_VALUE_PLACEHOLDER);
  });

  it('returns the placeholder when the list is empty', () => {
    expect(formatIpList([])).toBe(EMPTY_VALUE_PLACEHOLDER);
  });

  it('strips the /32 mask of a single IPv4 host', () => {
    expect(formatIpList(['203.0.113.10/32'])).toBe('203.0.113.10');
  });

  it('strips the /128 mask of a single IPv6 host', () => {
    expect(formatIpList(['2001:db8::1/128'])).toBe('2001:db8::1');
  });

  it('keeps any other prefix, which carries range information', () => {
    expect(formatIpList(['203.0.113.0/24'])).toBe('203.0.113.0/24');
    expect(formatIpList(['2001:db8::/64'])).toBe('2001:db8::/64');
  });

  it('does not strip a /32 written on an IPv6 address', () => {
    expect(formatIpList(['2001:db8::1/32'])).toBe('2001:db8::1/32');
  });

  it('keeps an IP written without any mask', () => {
    expect(formatIpList(['192.168.1.10'])).toBe('192.168.1.10');
  });

  it('joins every IP of the list', () => {
    expect(formatIpList(['203.0.113.10/32', '203.0.113.11/32', '203.0.113.0/24'])).toBe(
      '203.0.113.10, 203.0.113.11, 203.0.113.0/24',
    );
  });

  it('ignores blank entries', () => {
    expect(formatIpList(['  ', '203.0.113.10/32'])).toBe('203.0.113.10');
    expect(formatIpList(['  '])).toBe(EMPTY_VALUE_PLACEHOLDER);
  });
});

describe('firstIpWithoutMask', () => {
  it('strips the host mask of the first IPv4 of the list', () => {
    expect(firstIpWithoutMask(['203.0.113.10/32', '203.0.113.11/32'])).toBe('203.0.113.10');
  });

  it('strips the host mask of the first IPv6 of the list', () => {
    expect(firstIpWithoutMask(['2001:db8::1/128'])).toBe('2001:db8::1');
  });

  it('keeps any other prefix', () => {
    expect(firstIpWithoutMask(['203.0.113.0/24'])).toBe('203.0.113.0/24');
  });

  it('returns an empty string when the list is empty or missing', () => {
    expect(firstIpWithoutMask([])).toBe('');
    expect(firstIpWithoutMask()).toBe('');
  });
});
