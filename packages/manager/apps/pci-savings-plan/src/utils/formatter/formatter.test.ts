import { describe, it, expect } from 'vitest';
import { formatTechnicalInfo, formatPricingInfo } from './formatter';
import { createPricing } from '@/_mock_/commercial-catalog/pricing';
import { createTechnicalInfo } from '@/_mock_/commercial-catalog/technical';

describe('formatter utility functions', () => {
  describe('formatTechnicalInfo', () => {
    it('should format technical info correctly', () => {
      const technicalInfo = createTechnicalInfo({
        name: 'Technical Name',
        bandwidthLevel: 1,
        cpuCores: 1,
        cpuFrequency: 1,
        memorySize: 1,
      });

      const result = formatTechnicalInfo(technicalInfo);
      expect(result).toEqual({
        id: '1234',
        name: 'Technical Name',
        hourlyPrice: 1.3274,
        technical: {
          bandwidth: { guaranteed: false, level: 1, unlimited: true },
          cpu: { cores: 1, frequency: 1, model: 'vCore', type: 'vCore' },
          memory: { size: 1 },
          name: 'Technical Name',
          os: { family: 'linux' },
          storage: {
            disks: [
              {
                capacity: 400,
                number: 1,
                technology: 'NVMe',
              },
            ],
            raid: 'local',
          },
        },
      });
    });

    it('should return an empty object for invalid technical info', () => {
      const invalidTechnicalInfo = {};

      const result = formatTechnicalInfo(invalidTechnicalInfo);
      expect(result).toEqual({
        hourlyPrice: 0,
        id: undefined,
        name: undefined,
      });
    });
  });

  describe('formatPricingInfo', () => {
    it('should format pricing info correctly', () => {
      const pricingInfo = createPricing({
        name: 'Pricing Name',
        duration: 'P1M',
        amount: 2000,
      });

      const result = formatPricingInfo(pricingInfo);
      expect(result).toEqual({
        id: pricingInfo.id,
        code: pricingInfo.code,
        duration: 1,
        price: 0.00002,
      });
    });

    it('should return an empty object for invalid pricing info', () => {
      const invalidPricingInfo = {};

      const result = formatPricingInfo(invalidPricingInfo as any);
      expect(result).toEqual({});
    });
  });
});
