import { extractBandwidthLimitFromPlanCode } from '../bandwidth';

describe('bandwidth utils', () => {
  describe('extractBandwidthLimitFromPlanCode', () => {
    it('parses plan codes with g/m/t suffixes', () => {
      expect(
        extractBandwidthLimitFromPlanCode('outgoing-bandwidth-eu-10g'),
      ).toBe(10000);
      expect(
        extractBandwidthLimitFromPlanCode('outgoing-bandwidth-ap-200m'),
      ).toBe(200);
      expect(
        extractBandwidthLimitFromPlanCode('outgoing-bandwidth-eu-1t'),
      ).toBe(1000000);
    });

    it('falls back to multiplier 1 for unknown suffix', () => {
      expect(
        extractBandwidthLimitFromPlanCode('outgoing-bandwidth-eu-10x'),
      ).toBe(10);
    });

    it('returns 0 for empty plan code', () => {
      expect(extractBandwidthLimitFromPlanCode('')).toBe(0);
    });
  });
});
