import { describe, expect, it } from 'vitest';

import {
  fromIdToIp,
  fromIpToId,
  getIpv4SubIpList,
  ipFormatter,
} from './ipFormatter';

describe('ipFormatter utilities', () => {
  it('should convert id to ip string (fromIdToIp)', () => {
    expect(fromIdToIp('192-168-0-32_24')).toBe('192.168.0.32/24');
    expect(fromIdToIp('192-168-0-32')).toBe('192.168.0.32');
  });

  it('should convert ip to id string (fromIpToId)', () => {
    expect(fromIpToId('192.168.0.32/24')).toBe('192-168-0-32_24');
    expect(fromIpToId('192.168.0.32')).toBe('192-168-0-32');
  });

  it('should return ipGroup and metadata for IPv4 single address', () => {
    const input = '192.0.2.1';
    const { ipGroup, isGroup, ipAddress, ip, range } = ipFormatter(input);
    expect(ipGroup).toBe('192.0.2.1/32');
    expect(isGroup).toBe(false);
    expect(ipAddress).toBe(input);
    expect(ip).toBe(input);
    expect(range).toBeUndefined();
  });

  it('should return ipGroup and metadata for IPv4 block address', () => {
    const input = '192.0.2.1/24';
    const { ipGroup, isGroup, ipAddress, ip, range } = ipFormatter(input);
    expect(ipGroup).toBe('192.0.2.1/24');
    expect(isGroup).toBe(true);
    expect(ipAddress).toBe('192.0.2.1');
    expect(ip).toBe(input);
    expect(range).toBe(24);
  });

  it('should handle IPv6 addresses', () => {
    const input = '2001:db8::1';
    const { ipGroup, isGroup, ipAddress, ip, range } = ipFormatter(input);
    expect(ipGroup).toBe('2001:db8::1/128');
    expect(isGroup).toBe(false);
    expect(ipAddress).toBe(input);
    expect(ip).toBe(input);
    expect(range).toBeUndefined();
  });

  it('getIpv4SubIpList should return correct lists for different prefixes', () => {
    // /30 -> 4 addresses
    const list30 = getIpv4SubIpList('192.168.0.0/30');
    expect(Array.isArray(list30)).toBe(true);
    expect(list30).toHaveLength(4);
    expect(list30[0]).toBe('192.168.0.0');
    expect(list30[list30.length - 1]).toBe('192.168.0.3');

    // /29 -> 8 addresses
    const list29 = getIpv4SubIpList('192.168.1.0/29');
    expect(Array.isArray(list29)).toBe(true);
    expect(list29).toHaveLength(8);
    expect(list29[0]).toBe('192.168.1.0');
    expect(list29[list29.length - 1]).toBe('192.168.1.7');

    // /24 -> 256 addresses
    const list24 = getIpv4SubIpList('10.0.0.0/24');
    expect(Array.isArray(list24)).toBe(true);
    expect(list24).toHaveLength(256);
    expect(list24[0]).toBe('10.0.0.0');
    expect(list24[list24.length - 1]).toBe('10.0.0.255');
  });

  it('getIpv4SubIpList should return empty list for /32 and IPv6', () => {
    const list32 = getIpv4SubIpList('10.0.0.1/32');
    expect(Array.isArray(list32)).toBe(true);
    expect(list32).toHaveLength(0);

    const ipv6List = getIpv4SubIpList('2001:db8::/64');
    expect(Array.isArray(ipv6List)).toBe(true);
    expect(ipv6List).toHaveLength(0);
  });
});
