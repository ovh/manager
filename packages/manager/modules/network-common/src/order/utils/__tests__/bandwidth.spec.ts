import {
  ASIA_PACIFIC_DEFAULT_BANDWIDTH_LIMIT,
  DEFAULT_BANDWIDTH_LIMIT,
  extractBandwidthLimitFromPlanCode,
  isDefaultBandwidthOption,
} from '../bandwidth';

describe('bandwidth utils', () => {
  describe('isDefaultBandwidthOption', () => {
    it('returns true for DEFAULT_BANDWIDTH_LIMIT in EU/CA/US regions', () => {
      expect(
        isDefaultBandwidthOption({
          bandwidthLimit: DEFAULT_BANDWIDTH_LIMIT,
          region: 'eu-west-par',
        }),
      ).toBe(true);

      expect(
        isDefaultBandwidthOption({
          bandwidthLimit: DEFAULT_BANDWIDTH_LIMIT,
          region: 'ca-central',
        }),
      ).toBe(true);

      expect(
        isDefaultBandwidthOption({
          bandwidthLimit: DEFAULT_BANDWIDTH_LIMIT,
          region: 'us-east',
        }),
      ).toBe(true);
    });

    it('is case-insensitive and checks prefix', () => {
      expect(
        isDefaultBandwidthOption({
          bandwidthLimit: DEFAULT_BANDWIDTH_LIMIT,
          region: 'EU-west',
        }),
      ).toBe(true);
    });

    it('returns true for AP default bandwidth in ap- regions', () => {
      expect(
        isDefaultBandwidthOption({
          bandwidthLimit: ASIA_PACIFIC_DEFAULT_BANDWIDTH_LIMIT,
          region: 'ap-southeast',
        }),
      ).toBe(true);
    });

    it('returns false for non-default limits or mismatching region', () => {
      expect(
        isDefaultBandwidthOption({ bandwidthLimit: 100, region: 'eu-west' }),
      ).toBe(false);

      expect(
        isDefaultBandwidthOption({
          bandwidthLimit: DEFAULT_BANDWIDTH_LIMIT,
          region: 'ap-east',
        }),
      ).toBe(false);
    });
  });

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
