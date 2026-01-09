/* eslint-disable max-lines */
import { describe, expect, it, vi } from 'vitest';

import { SHARED_CDN_OPTIONS } from '@/constants';
import {
  CdnOption,
  CdnOptionType,
  CdnQueryParameters,
  PatternType,
} from '@/data/types/product/cdn';
import {
  SHARED_CDN_SETTINGS_RULE_FACTOR_DAY,
  SHARED_CDN_SETTINGS_RULE_FACTOR_HOUR,
  SHARED_CDN_SETTINGS_RULE_FACTOR_MINUTE,
  SHARED_CDN_SETTINGS_RULE_FACTOR_SECOND,
} from '@/utils';

import {
  cdnFormDefaultValues,
  convertToHstsUnit,
  convertToTtl,
  convertToUnitTime,
  findOption,
  getPrewarmQuotaPercentage,
  getQuotaUsage,
  hasOption,
  hasSecurityOption,
  isOptionEnabled,
} from '../cdn';

describe('cdn utils', () => {
  const mockT = vi.fn((key: string) => key);

  describe('isOptionEnabled', () => {
    it('should return true when option is enabled', () => {
      const options: CdnOption[] = [
        {
          type: CdnOptionType.BROTLI,
          enabled: true,
          pattern: '',
          config: { ttl: 0, patternType: PatternType.URI, priority: 0 },
        },
      ];
      expect(isOptionEnabled(options, CdnOptionType.BROTLI)).toBe(true);
    });

    it('should return false when option is disabled', () => {
      const options: CdnOption[] = [
        {
          type: CdnOptionType.BROTLI,
          enabled: false,
          pattern: '',
          config: { ttl: 0, patternType: PatternType.URI, priority: 0 },
        },
      ];
      expect(isOptionEnabled(options, CdnOptionType.BROTLI)).toBe(false);
    });

    it('should return false when option does not exist', () => {
      const options: CdnOption[] = [];
      expect(isOptionEnabled(options, CdnOptionType.BROTLI)).toBe(false);
    });

    it('should return false when options is undefined', () => {
      expect(isOptionEnabled(undefined as unknown as CdnOption[], CdnOptionType.BROTLI)).toBe(
        false,
      );
    });
  });

  describe('hasOption', () => {
    it('should return true when option exists', () => {
      const options: CdnOption[] = [
        {
          type: CdnOptionType.BROTLI,
          enabled: true,
          pattern: '',
          config: { ttl: 0, patternType: PatternType.URI, priority: 0 },
        },
      ];
      expect(hasOption(options, CdnOptionType.BROTLI)).toBe(true);
    });

    it('should return false when option does not exist', () => {
      const options: CdnOption[] = [
        {
          type: CdnOptionType.GEO_HEADERS,
          enabled: true,
          pattern: '',
          config: { ttl: 0, patternType: PatternType.URI, priority: 0 },
        },
      ];
      expect(hasOption(options, CdnOptionType.BROTLI)).toBe(false);
    });

    it('should return false when options is empty', () => {
      expect(hasOption([], CdnOptionType.BROTLI)).toBe(false);
    });
  });

  describe('findOption', () => {
    it('should return the option when it exists', () => {
      const option: CdnOption = {
        type: CdnOptionType.BROTLI,
        enabled: true,
        pattern: '',
        config: { ttl: 0, patternType: PatternType.URI, priority: 0 },
      };
      const options: CdnOption[] = [option];
      expect(findOption(options, CdnOptionType.BROTLI)).toEqual(option);
    });

    it('should return undefined when option does not exist', () => {
      const options: CdnOption[] = [
        {
          type: CdnOptionType.GEO_HEADERS,
          enabled: true,
          pattern: '',
          config: { ttl: 0, patternType: PatternType.URI, priority: 0 },
        },
      ];
      expect(findOption(options, CdnOptionType.BROTLI)).toBeUndefined();
    });
  });

  describe('getPrewarmQuotaPercentage', () => {
    it('should calculate percentage correctly', () => {
      const options: CdnOption[] = [
        {
          type: CdnOptionType.PREWARM,
          enabled: true,
          pattern: '',
          config: { ttl: 0, patternType: PatternType.URI, priority: 0 },
          extra: {
            usage: 50,
            quota: 100,
          },
        },
      ];
      expect(getPrewarmQuotaPercentage(options)).toBe(50);
    });

    it('should return 0 when usage is 0', () => {
      const options: CdnOption[] = [
        {
          type: CdnOptionType.PREWARM,
          enabled: true,
          pattern: '',
          config: { ttl: 0, patternType: PatternType.URI, priority: 0 },
          extra: {
            usage: 0,
            quota: 100,
          },
        },
      ];
      expect(getPrewarmQuotaPercentage(options)).toBe(0);
    });

    it('should handle missing extra data', () => {
      const options: CdnOption[] = [
        {
          type: CdnOptionType.PREWARM,
          enabled: true,
          pattern: '',
          config: { ttl: 0, patternType: PatternType.URI, priority: 0 },
        },
      ];
      expect(getPrewarmQuotaPercentage(options)).toBeNaN();
    });
  });

  describe('getQuotaUsage', () => {
    it('should format quota usage correctly', () => {
      const options: CdnOption[] = [
        {
          type: CdnOptionType.PREWARM,
          enabled: true,
          pattern: '',
          config: { ttl: 0, patternType: PatternType.URI, priority: 0 },
          extra: {
            usage: 1024,
            quota: 2048,
          },
        },
      ];
      const result = getQuotaUsage(options);
      expect(result).toContain('Ko');
      expect(result).toContain('50.00%');
    });

    it('should handle zero usage', () => {
      const options: CdnOption[] = [
        {
          type: CdnOptionType.PREWARM,
          enabled: true,
          pattern: '',
          config: { ttl: 0, patternType: PatternType.URI, priority: 0 },
          extra: {
            usage: 0,
            quota: 1024,
          },
        },
      ];
      const result = getQuotaUsage(options);
      expect(result).toContain('0 o');
      expect(result).toContain('0.00%');
    });

    it('should handle large values in Go', () => {
      const options: CdnOption[] = [
        {
          type: CdnOptionType.PREWARM,
          enabled: true,
          pattern: '',
          config: { ttl: 0, patternType: PatternType.URI, priority: 0 },
          extra: {
            usage: 1024 * 1024 * 1024,
            quota: 2 * 1024 * 1024 * 1024,
          },
        },
      ];
      const result = getQuotaUsage(options);
      expect(result).toContain('Go');
      expect(result).toContain('50.00%');
    });
  });

  describe('convertToUnitTime', () => {
    beforeEach(() => {
      mockT.mockImplementation((key: string) => {
        const translations: Record<string, string> = {
          cdn_shared_modal_add_rule_field_time_to_live_unit_days: 'days',
          cdn_shared_modal_add_rule_field_time_to_live_unit_hours: 'hours',
          cdn_shared_modal_add_rule_field_time_to_live_unit_minutes: 'minutes',
        };
        return translations[key] || key;
      });
    });

    it('should convert to hours when TTL is divisible by hour factor', () => {
      const ttl = 3 * SHARED_CDN_SETTINGS_RULE_FACTOR_HOUR;
      const result = convertToUnitTime(ttl, mockT);
      expect(result.timeValue).toBe(3);
      expect(result.timeUnit).toBe('hours');
    });

    it('should convert to minutes when TTL is divisible by minute factor', () => {
      const ttl = 5 * SHARED_CDN_SETTINGS_RULE_FACTOR_MINUTE;
      const result = convertToUnitTime(ttl, mockT);
      expect(result.timeValue).toBe(5);
      expect(result.timeUnit).toBe('minutes');
    });

    it('should prefer days over hours when both are divisible', () => {
      const ttl = SHARED_CDN_SETTINGS_RULE_FACTOR_DAY;
      const result = convertToUnitTime(ttl, mockT);
      expect(result.timeValue).toBe(1);
      expect(result.timeUnit).toBe('days');
    });
  });

  describe('convertToHstsUnit', () => {
    it('should convert to seconds when TTL is divisible by second factor', () => {
      const ttl = 5 * SHARED_CDN_SETTINGS_RULE_FACTOR_SECOND;
      const result = convertToHstsUnit(ttl);
      expect(result.age).toBe(5);
      expect(result.unit).toBe(SHARED_CDN_SETTINGS_RULE_FACTOR_SECOND);
    });

    it('should prefer seconds over days when both are divisible', () => {
      const ttl = SHARED_CDN_SETTINGS_RULE_FACTOR_SECOND;
      const result = convertToHstsUnit(ttl);
      expect(result.age).toBe(1);
      expect(result.unit).toBe(SHARED_CDN_SETTINGS_RULE_FACTOR_SECOND);
    });
  });

  describe('convertToTtl', () => {
    beforeEach(() => {
      mockT.mockImplementation((key: string) => {
        const translations: Record<string, string> = {
          cdn_shared_modal_add_rule_field_time_to_live_unit_days: 'days',
          cdn_shared_modal_add_rule_field_time_to_live_unit_hours: 'hours',
          cdn_shared_modal_add_rule_field_time_to_live_unit_minutes: 'minutes',
        };
        return translations[key] || key;
      });
    });

    it('should convert days to TTL', () => {
      const result = convertToTtl(
        2,
        mockT('cdn_shared_modal_add_rule_field_time_to_live_unit_days'),
        mockT,
      );
      expect(result).toBe(2 * SHARED_CDN_SETTINGS_RULE_FACTOR_DAY);
    });

    it('should convert hours to TTL', () => {
      const result = convertToTtl(
        3,
        mockT('cdn_shared_modal_add_rule_field_time_to_live_unit_hours'),
        mockT,
      );
      expect(result).toBe(3 * SHARED_CDN_SETTINGS_RULE_FACTOR_HOUR);
    });

    it('should convert minutes to TTL', () => {
      const result = convertToTtl(
        5,
        mockT('cdn_shared_modal_add_rule_field_time_to_live_unit_minutes'),
        mockT,
      );
      expect(result).toBe(5 * SHARED_CDN_SETTINGS_RULE_FACTOR_MINUTE);
    });

    it('should return 0 for unknown unit', () => {
      const result = convertToTtl(10, 'unknown', mockT);
      expect(result).toBe(0);
    });
  });

  describe('cdnFormDefaultValues', () => {
    beforeEach(() => {
      mockT.mockImplementation((key: string) => key);
    });

    it('should create default values from options', () => {
      const options: CdnOption[] = [
        {
          type: CdnOptionType.BROTLI,
          enabled: true,
          pattern: '',
          config: { ttl: 0, patternType: PatternType.URI, priority: 0 },
        },
        {
          type: CdnOptionType.GEO_HEADERS,
          enabled: false,
          pattern: '',
          config: { ttl: 0, patternType: PatternType.URI, priority: 0 },
        },
        {
          type: CdnOptionType.HSTS,
          enabled: true,
          pattern: '',
          config: {
            ttl: SHARED_CDN_SETTINGS_RULE_FACTOR_DAY,
            patternType: PatternType.URI,
            priority: 0,
          },
        },
        {
          type: CdnOptionType.MOBILE_REDIRECT,
          enabled: true,
          pattern: '',
          config: {
            ttl: 0,
            patternType: PatternType.URI,
            priority: 0,
            followUri: true,
            destination: 'https://example.com',
          },
        },
        {
          type: CdnOptionType.CORS,
          enabled: true,
          pattern: '',
          config: {
            ttl: 0,
            patternType: PatternType.URI,
            priority: 0,
            resources: ['https://example.com'],
          },
        },
        {
          type: CdnOptionType.PREWARM,
          enabled: true,
          pattern: '',
          config: {
            ttl: 0,
            patternType: PatternType.URI,
            priority: 0,
            resources: ['https://example.com'],
          },
        },
        {
          type: CdnOptionType.QUERYSTRING,
          enabled: true,
          pattern: '',
          config: {
            ttl: 0,
            patternType: PatternType.URI,
            priority: 0,
            queryParameters: CdnQueryParameters.SORTED,
          },
        },
        {
          type: CdnOptionType.HTTPS_REDIRECT,
          enabled: true,
          pattern: '',
          config: {
            ttl: 0,
            patternType: PatternType.URI,
            priority: 0,
            statusCode: 301,
          },
        },
      ];

      const result = cdnFormDefaultValues(options);

      expect(result.brotli).toBe(true);
      expect(result.geoHeaders).toBe(false);
      expect(result.hsts).toBe(true);
      expect(result.mobileRedirect).toBe(true);
      expect(result.mobileRedirectType).toBe(SHARED_CDN_OPTIONS.MOBILE_REDIRECT.STILL_URL);
      expect(result.mobileRedirectUrl).toBe('https://example.com');
      expect(result.corsResources).toEqual(['https://example.com']);
      expect(result.premwarmResources).toEqual(['https://example.com']);
      expect(result.querytringParam).toBe('sorted');
      expect(result.httpsRedirectCode).toBe(301);
    });

    it('should handle mobile redirect with followUri false', () => {
      const options: CdnOption[] = [
        {
          type: CdnOptionType.MOBILE_REDIRECT,
          enabled: true,
          pattern: '',
          config: {
            ttl: 0,
            patternType: PatternType.URI,
            priority: 0,
            followUri: false,
            destination: 'https://example.com',
          },
        },
      ];

      const result = cdnFormDefaultValues(options);
      expect(result.mobileRedirectType).toBe(SHARED_CDN_OPTIONS.MOBILE_REDIRECT.KEEP_URL);
    });
  });

  describe('hasSecurityOption', () => {
    it('should return true when CORS option exists', () => {
      const options: CdnOption[] = [
        {
          type: CdnOptionType.CORS,
          enabled: true,
          pattern: '',
          config: { ttl: 0, patternType: PatternType.URI, priority: 0 },
        },
      ];
      expect(hasSecurityOption(options)).toBe(true);
    });

    it('should return true when HTTPS_REDIRECT option exists', () => {
      const options: CdnOption[] = [
        {
          type: CdnOptionType.HTTPS_REDIRECT,
          enabled: true,
          pattern: '',
          config: { ttl: 0, patternType: PatternType.URI, priority: 0 },
        },
      ];
      expect(hasSecurityOption(options)).toBe(true);
    });

    it('should return true when HSTS option exists', () => {
      const options: CdnOption[] = [
        {
          type: CdnOptionType.HSTS,
          enabled: true,
          pattern: '',
          config: { ttl: 0, patternType: PatternType.URI, priority: 0 },
        },
      ];
      expect(hasSecurityOption(options)).toBe(true);
    });

    it('should return true when MIXED_CONTENT option exists', () => {
      const options: CdnOption[] = [
        {
          type: CdnOptionType.MIXED_CONTENT,
          enabled: true,
          pattern: '',
          config: { ttl: 0, patternType: PatternType.URI, priority: 0 },
        },
      ];
      expect(hasSecurityOption(options)).toBe(true);
    });

    it('should return true when WAF option exists', () => {
      const options: CdnOption[] = [
        {
          type: CdnOptionType.WAF,
          enabled: true,
          pattern: '',
          config: { ttl: 0, patternType: PatternType.URI, priority: 0 },
        },
      ];
      expect(hasSecurityOption(options)).toBe(true);
    });

    it('should return false when no security options exist', () => {
      const options: CdnOption[] = [
        {
          type: CdnOptionType.BROTLI,
          enabled: true,
          pattern: '',
          config: { ttl: 0, patternType: PatternType.URI, priority: 0 },
        },
      ];
      expect(hasSecurityOption(options)).toBe(false);
    });

    it('should return false when options is empty', () => {
      expect(hasSecurityOption([])).toBe(false);
    });
  });
});
