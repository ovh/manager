import { describe, expect, it } from 'vitest';

import { isValidIp, isValidIpv4, isValidIpv6 } from './isValidIp';

describe('isValidIpv4', () => {
  it.each(['192.168.1.10', '10.0.0.1', '255.255.255.255', '0.0.0.0', '185.26.17.45'])(
    "accepte l'IPv4 valide %s",
    (value) => {
      expect(isValidIpv4(value)).toBe(true);
    },
  );

  it.each(['256.0.0.1', '192.168.1', '192.168.1.1.1', '1.2.3.256', 'abc', '', '::1'])(
    "rejette l'IPv4 invalide %s",
    (value) => {
      expect(isValidIpv4(value)).toBe(false);
    },
  );

  it('ignore les espaces autour', () => {
    expect(isValidIpv4('  10.0.0.1  ')).toBe(true);
  });
});

describe('isValidIpv6', () => {
  it.each([
    '::1',
    '::',
    '2001:db8::1',
    '2001:0db8:0000:0000:0000:0000:0000:0001',
    'fe80::1',
    '::ffff:192.168.0.1',
  ])("accepte l'IPv6 valide %s", (value) => {
    expect(isValidIpv6(value)).toBe(true);
  });

  it.each(['192.168.1.1', '2001::db8::1', 'gggg::1', '12345::1', '', '2001:db8'])(
    "rejette l'IPv6 invalide %s",
    (value) => {
      expect(isValidIpv6(value)).toBe(false);
    },
  );
});

describe('isValidIp', () => {
  it('accepte IPv4 et IPv6', () => {
    expect(isValidIp('10.0.0.1')).toBe(true);
    expect(isValidIp('2001:db8::1')).toBe(true);
  });

  it("rejette une valeur qui n'est ni IPv4 ni IPv6", () => {
    expect(isValidIp('not-an-ip')).toBe(false);
  });
});
