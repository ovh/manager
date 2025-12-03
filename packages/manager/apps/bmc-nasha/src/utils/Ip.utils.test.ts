import { describe, expect, it } from 'vitest';

import { ipBlockToNumber, sortByIpBlock } from './Ip.utils';

describe('Ip.utils', () => {
  describe('ipBlockToNumber', () => {
    it('should convert IP block to number', () => {
      expect(ipBlockToNumber('192.168.1.0/24')).toBe(192168001024);
      expect(ipBlockToNumber('10.0.0.0/8')).toBe(10000000008);
      expect(ipBlockToNumber('172.16.0.0/12')).toBe(172016000012);
    });

    it('should handle IP addresses without CIDR notation', () => {
      expect(ipBlockToNumber('192.168.1.1/32')).toBe(192168001001032);
      expect(ipBlockToNumber('10.0.0.1/32')).toBe(10000000001032);
    });

    it('should pad numbers correctly', () => {
      // 10.0.0.0/8 should be 010.000.000.000.008
      expect(ipBlockToNumber('10.0.0.0/8')).toBe(10000000008);
      // 192.168.1.1/32 should be 192.168.001.001.032
      expect(ipBlockToNumber('192.168.1.1/32')).toBe(192168001001032);
    });
  });

  describe('sortByIpBlock', () => {
    it('should sort IP blocks in ascending order', () => {
      const ipBlocks = ['192.168.1.0/24', '10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16'];

      const sorted = ipBlocks.sort(sortByIpBlock);

      expect(sorted).toEqual(['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16', '192.168.1.0/24']);
    });

    it('should sort mixed IPs and blocks correctly', () => {
      const mixed = ['192.168.1.1/32', '10.0.0.0/8', '192.168.1.0/24', '10.0.0.1/32'];

      const sorted = mixed.sort(sortByIpBlock);

      expect(sorted).toEqual(['10.0.0.0/8', '10.0.0.1/32', '192.168.1.0/24', '192.168.1.1/32']);
    });

    it('should handle single IP address', () => {
      const ips = ['192.168.1.1/32'];
      const sorted = ips.sort(sortByIpBlock);
      expect(sorted).toEqual(['192.168.1.1/32']);
    });

    it('should handle empty array', () => {
      const ips: string[] = [];
      const sorted = ips.sort(sortByIpBlock);
      expect(sorted).toEqual([]);
    });

    it('should sort subnets within the same network', () => {
      const subnets = ['192.168.1.0/26', '192.168.1.0/24', '192.168.1.0/25', '192.168.1.0/32'];

      const sorted = subnets.sort(sortByIpBlock);

      expect(sorted).toEqual([
        '192.168.1.0/24',
        '192.168.1.0/25',
        '192.168.1.0/26',
        '192.168.1.0/32',
      ]);
    });
  });

  describe('AngularJS parity', () => {
    it('should produce the same sort order as AngularJS ipBlockToNumber', () => {
      // Test case from AngularJS code
      const ipBlocks = [
        '212.83.128.0/17',
        '10.0.0.0/8',
        '172.16.0.0/12',
        '192.168.0.0/16',
        '91.121.0.0/16',
      ];

      const sorted = ipBlocks.sort(sortByIpBlock);

      // Expected order: numerical by first octet, then second, etc.
      expect(sorted).toEqual([
        '10.0.0.0/8',
        '91.121.0.0/16',
        '172.16.0.0/12',
        '192.168.0.0/16',
        '212.83.128.0/17',
      ]);
    });

    it('should handle the exact format returned by OVH API', () => {
      // IPs returned by authorizableIps endpoint (with /32 added)
      const ips = ['192.168.1.1/32', '10.0.0.1/32', '172.16.0.1/32'];

      const sorted = ips.sort(sortByIpBlock);

      expect(sorted).toEqual(['10.0.0.1/32', '172.16.0.1/32', '192.168.1.1/32']);
    });

    it('should handle blocks returned by authorizableBlocks endpoint', () => {
      const blocks = ['192.168.0.0/24', '10.0.0.0/16', '172.16.0.0/20'];

      const sorted = blocks.sort(sortByIpBlock);

      expect(sorted).toEqual(['10.0.0.0/16', '172.16.0.0/20', '192.168.0.0/24']);
    });
  });
});
