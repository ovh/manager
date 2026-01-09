import { describe, it, expect, vi } from 'vitest';

import {
  hasPortRangeError,
  hasDestinationPortLowerThanSourcePortError,
  hasSourceError,
  formatSourceValue,
  IP_EDGE_FIREWALL_PORT_MIN,
  IP_EDGE_FIREWALL_PORT_MAX,
  formatPortValue,
  formatPortRangeValue,
} from './useCreateIpEdgeFirewallRule';

describe('useCreateIpEdgeFirewallRule helpers', () => {
  describe('hasPortRangeError', () => {
    it('returns false for undefined or empty', () => {
      expect(hasPortRangeError(undefined)).toBe(false);
      expect(hasPortRangeError('')).toBe(false);
    });

    it('returns true for values below min and above max', () => {
      expect(
        hasPortRangeError(String(IP_EDGE_FIREWALL_PORT_MIN - 1)),
      ).toBeTruthy();
      expect(
        hasPortRangeError(String(IP_EDGE_FIREWALL_PORT_MAX + 1)),
      ).toBeTruthy();
    });

    it('returns false for values inside range and edges', () => {
      expect(hasPortRangeError(String(IP_EDGE_FIREWALL_PORT_MIN))).toBe(false);
      expect(hasPortRangeError(String(IP_EDGE_FIREWALL_PORT_MAX))).toBe(false);
      expect(hasPortRangeError('80')).toBe(false);
    });

    it('handles non-numeric strings gracefully', () => {
      expect(hasPortRangeError('abc')).toBe(false);
    });

    it('handles port ranges', () => {
      expect(hasPortRangeError('80-90')).toBe(false);
      expect(hasPortRangeError('0-65535')).toBe(false);
      expect(hasPortRangeError('65536-70000')).toBe(true);
      expect(hasPortRangeError('-100')).toBe(true);
      expect(hasPortRangeError('100-')).toBe(true);
      expect(hasPortRangeError('200-100')).toBe(true);
    });
  });

  describe('hasDestinationPortLowerThanSourcePortError', () => {
    it('returns false when source or destination missing', () => {
      expect(hasDestinationPortLowerThanSourcePortError({})).toBeFalsy();
      expect(
        hasDestinationPortLowerThanSourcePortError({
          source: '10',
        }),
      ).toBeFalsy();
      expect(
        hasDestinationPortLowerThanSourcePortError({
          destination: '10',
        }),
      ).toBeFalsy();
    });

    it('returns true when destination < source', () => {
      expect(
        hasDestinationPortLowerThanSourcePortError({
          source: '1000',
          destination: '80',
        }),
      ).toBeTruthy();
    });

    it('returns false when destination >= source', () => {
      expect(
        hasDestinationPortLowerThanSourcePortError({
          source: '80',
          destination: '80',
        }),
      ).toBeFalsy();
      expect(
        hasDestinationPortLowerThanSourcePortError({
          source: '80',
          destination: '90',
        }),
      ).toBeFalsy();
    });

    it('handles non-numeric strings (parseInt -> NaN) gracefully', () => {
      // parseInt('a') === NaN, NaN < number is false -> returns false
      expect(
        hasDestinationPortLowerThanSourcePortError({
          source: 'a',
          destination: '1',
        }),
      ).toBeFalsy();
      expect(
        hasDestinationPortLowerThanSourcePortError({
          source: '1',
          destination: 'b',
        }),
      ).toBeFalsy();
    });

    it('returns false when source or destination are port ranges', () => {
      expect(
        hasDestinationPortLowerThanSourcePortError({
          source: '80-90',
          destination: '85',
        }),
      ).toBeFalsy();
      expect(
        hasDestinationPortLowerThanSourcePortError({
          source: '80',
          destination: '70-80',
        }),
      ).toBeFalsy();
    });
  });

  describe('hasSourceError', () => {
    it('returns false for undefined or empty', () => {
      expect(hasSourceError(undefined)).toBe(false);
      expect(hasSourceError('')).toBe(false);
    });

    it('validates IPv4 single addresses using ipaddr', () => {
      // valid keywords
      expect(hasSourceError(undefined)).toBe(false);
      expect(hasSourceError('')).toBe(false);
      expect(hasSourceError('any')).toBe(false);
      expect(hasSourceError('ALL')).toBe(false);
      expect(hasSourceError('AlL')).toBe(false);
      // valid IPv4
      expect(hasSourceError('192.168.0.1')).toBe(false);
      expect(hasSourceError('0.0.0.0')).toBe(false);
      expect(hasSourceError('0.0.0.0/0')).toBe(false);
      // invalid IPv4
      expect(hasSourceError('999.999.999.999')).toBe(true);
    });

    it('validates IPv4 blocks using isValidIpv4Block', () => {
      expect(hasSourceError('10.0.0.0/24')).toBe(false);
      expect(hasSourceError('10.0.0.')).toBe(true);
    });
  });

  describe('formatSourceValue', () => {
    it('returns null for undefined, empty, any, all, or containing 0.0.0.0', () => {
      expect(formatSourceValue(undefined)).toBeNull();
      expect(formatSourceValue('')).toBeNull();
      expect(formatSourceValue('any')).toBeNull();
      expect(formatSourceValue('ALL')).toBeNull();
      expect(formatSourceValue('AlL')).toBeNull();
      expect(formatSourceValue('0.0.0.0')).toBeNull();
      expect(formatSourceValue('0.0.0.0/0')).toBeNull();
    });

    it('appends /32 to single IPv4 addresses', () => {
      expect(formatSourceValue('192.168.0.1')).toBe('192.168.0.1/32');
    });

    it('keeps CIDR blocks untouched', () => {
      expect(formatSourceValue('10.0.0.0/24')).toBe('10.0.0.0/24');
    });
  });

  describe('formatPortValue', () => {
    it('returns undefined for undefined, empty or ranges', () => {
      expect(formatPortValue(undefined)).toBeUndefined();
      expect(formatPortValue('')).toBeUndefined();
      expect(formatPortValue('80-90')).toBeUndefined();
    });

    it('parses numeric ports', () => {
      expect(formatPortValue('80')).toBe(80);
      expect(formatPortValue('0')).toBe(0);
      expect(formatPortValue(String(IP_EDGE_FIREWALL_PORT_MAX))).toBe(
        IP_EDGE_FIREWALL_PORT_MAX,
      );
    });

    it('returns NaN for non-numeric strings', () => {
      const v = formatPortValue('abc');
      expect(Number.isNaN(v as number)).toBe(true);
    });
  });

  describe('formatPortRangeValue', () => {
    it('returns undefined for undefined or non-range values', () => {
      expect(formatPortRangeValue(undefined)).toBeUndefined();
      expect(formatPortRangeValue('80')).toBeUndefined();
    });

    it('returns undefined for missing start or end', () => {
      expect(formatPortRangeValue('-100')).toBeUndefined();
      expect(formatPortRangeValue('100-')).toBeUndefined();
    });

    it('returns lt when start equals min', () => {
      expect(formatPortRangeValue(`0-1024`)).toBe('lt 1024');
    });

    it('returns gt when end equals max', () => {
      expect(formatPortRangeValue(`1024-${IP_EDGE_FIREWALL_PORT_MAX}`)).toBe(
        `gt 1024`,
      );
    });

    it('returns range otherwise', () => {
      expect(formatPortRangeValue('80-90')).toBe('range 80 90');
      expect(formatPortRangeValue('200-100')).toBe('range 200 100');
      expect(formatPortRangeValue('a-b')).toBe('range a b');
    });
  });
});
