import { describe, expect, it } from 'vitest';

import {
  IP_EDGE_FIREWALL_PORT_MAX,
  IP_EDGE_FIREWALL_PORT_MIN,
  formatSourceValue,
  hasDestinationPortLowerThanSourcePortError,
  hasPortRangeError,
  hasSourceError,
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
});
