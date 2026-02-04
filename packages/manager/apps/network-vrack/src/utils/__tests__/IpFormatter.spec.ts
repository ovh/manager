import { fromIdToIp, fromIpToId } from '../ipFormatter';

describe('IpFormatter', () => {
  describe('fromIpToId', () => {
    it('should convert an IP to an id url parameter', () => {
      // Given / When
      const output = fromIpToId('5.135.62.80/28');

      // Then
      expect(output).toBe('5-135-62-80_28');
    });
  });
  describe('fromIdToIp', () => {
    it('should convert an id url parameter to an IP', () => {
      // Given / When
      const output = fromIdToIp('5-135-62-80_28');

      // Then
      expect(output).toBe('5.135.62.80/28');
    });
  });
});
