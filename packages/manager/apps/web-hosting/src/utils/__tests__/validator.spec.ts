import { describe, expect, it } from 'vitest';

import { isValidDomain, isValidIpv4, isValidIpv6 } from '../validator';

describe('Validator Utilities', () => {
  describe('isValidIpv4', () => {
    it('should return true for valid IPv4 addresses', () => {
      expect(isValidIpv4('192.168.1.1')).toBe(true);
      expect(isValidIpv4('10.0.0.1')).toBe(true);
      expect(isValidIpv4('255.255.255.255')).toBe(true);
    });

    it('should return false for invalid IPv4 addresses', () => {
      expect(isValidIpv4('256.1.1.1')).toBe(false);
      expect(isValidIpv4('192.168.1')).toBe(false);
      expect(isValidIpv4('192.168.1.1.1')).toBe(false);
      expect(isValidIpv4('invalid')).toBe(false);
    });
  });

  describe('isValidIpv6', () => {
    it('should return true for valid IPv6 addresses', () => {
      expect(isValidIpv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(true);
      expect(isValidIpv6('2001:db8:85a3:0:0:8a2e:370:7334')).toBe(true);
      expect(isValidIpv6('2001:db8:85a3::8a2e:370:7334')).toBe(true);
      expect(isValidIpv6('::1')).toBe(true);
      expect(isValidIpv6('::')).toBe(true);
    });

    it('should return false for invalid IPv6 addresses', () => {
      expect(isValidIpv6('invalid')).toBe(false);
      expect(isValidIpv6('2001:0db8:85a3::8a2e::7334')).toBe(false);
      expect(isValidIpv6('12345::1')).toBe(false);
    });

    it('should return false for null or undefined values', () => {
      expect(isValidIpv6(null)).toBe(false);
      expect(isValidIpv6(undefined)).toBe(false);
    });
  });

  describe('isValidDomain', () => {
    it('should return true for valid domains', () => {
      expect(isValidDomain('example.com')).toBe(true);
      expect(isValidDomain('sub.example.com')).toBe(true);
      expect(isValidDomain('example-domain.com')).toBe(true);
      expect(isValidDomain('xn--fsq.xn--fiqs8s')).toBe(true);
    });

    it('should return false for invalid domains', () => {
      expect(isValidDomain('example')).toBe(false);
      expect(isValidDomain('.example.com')).toBe(false);
      expect(isValidDomain('example.com.')).toBe(false);
      expect(isValidDomain('-example.com')).toBe(false);
      expect(isValidDomain('example-.com')).toBe(false);
      expect(isValidDomain('example..com')).toBe(false);
      expect(isValidDomain('a'.repeat(64) + '.com')).toBe(false);
      expect(isValidDomain('example.com')).toBe(true);
    });

    it('should handle underscore options correctly', () => {
      expect(isValidDomain('_foo.example.com')).toBe(false);
      expect(isValidDomain('_foo.example.com', { canBeginWithUnderscore: true })).toBe(true);
      expect(isValidDomain('foo_bar.example.com', { canContainsUnderscore: true })).toBe(true);
    });

    it('should handle wildcard options correctly', () => {
      expect(isValidDomain('*.example.com', { canBeginWithWildcard: true })).toBe(true);
      expect(isValidDomain('*.example.com', { canBeginWithWildcard: false })).toBe(false);
    });

    it('should return false for IP addresses', () => {
      expect(isValidDomain('192.168.1.1')).toBe(false);
      expect(isValidDomain('2001:db8::1')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isValidDomain('a.b')).toBe(true);
      expect(isValidDomain('a..b')).toBe(false);
      expect(isValidDomain('example.com')).toBe(true);
      expect(isValidDomain('EXAMPLE.COM')).toBe(true);
    });
  });
});
