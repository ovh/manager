import { describe, it, expect } from 'vitest';
import { getGatewayFromCIDR } from './ipaddrUtilities';

describe('getGatewayFromCIDR function', () => {
  it.each([
    ['192.168.1.0/24', '192.168.1.254/24'],
    ['192.168.1.10/24', '192.168.1.254/24'],
    ['192.168.1.200/25', '192.168.1.254/25'],
    ['10.0.0.44/16', '10.0.255.254/16'],
    ['172.16.5.33/20', '172.16.15.254/20'],
  ])('getGatewayFromCIDR("%s") returns "%s"', (input, expected) => {
    if (expected.startsWith('Invalid')) {
      expect(() => getGatewayFromCIDR(input)).toThrow(expected);
    } else {
      expect(getGatewayFromCIDR(input)).toBe(expected);
    }
  });
});
