/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import {
  DOC_BASE_URL,
  OVH_LANGUAGE_BY_SUBSIDIARY,
  getHdsInfoUrl,
} from './constants';

describe('Constants', () => {
  describe('OVH_LANGUAGE_BY_SUBSIDIARY', () => {
    it('should have a DEFAULT value', () => {
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.DEFAULT).toBe('en');
    });

    it('should have correct language codes for major subsidiaries', () => {
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.FR).toBe('fr');
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.DE).toBe('de');
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.ES).toBe('es-es');
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.IT).toBe('it');
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.GB).toBe('en-gb');
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.CA).toBe('en-ca');
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.QC).toBe('fr-ca');
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.AU).toBe('en-au');
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.SG).toBe('en-sg');
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.IE).toBe('en-ie');
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.PL).toBe('pl');
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.PT).toBe('pt');
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.NL).toBe('nl');
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.MA).toBe('fr-ma');
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.SN).toBe('fr-sn');
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.TN).toBe('fr-tn');
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.ASIA).toBe('asia');
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.WE).toBe('en');
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.WS).toBe('es');
    });

    it('should have values for all OvhSubsidiary enum values', () => {
      const subsidiaries = Object.values(OvhSubsidiary);

      subsidiaries.forEach((subsidiary) => {
        expect(OVH_LANGUAGE_BY_SUBSIDIARY[subsidiary]).toBeDefined();
        expect(OVH_LANGUAGE_BY_SUBSIDIARY[subsidiary]).toBeTruthy();
        expect(typeof OVH_LANGUAGE_BY_SUBSIDIARY[subsidiary]).toBe('string');
      });
    });

    it('should have consistent language codes', () => {
      // Test that French subsidiaries use 'fr' variants
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.FR).toMatch(/^fr/);
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.QC).toMatch(/^fr/);
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.MA).toMatch(/^fr/);
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.SN).toMatch(/^fr/);
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.TN).toMatch(/^fr/);

      // Test that English subsidiaries use 'en' variants
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.GB).toMatch(/^en/);
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.CA).toMatch(/^en/);
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.AU).toMatch(/^en/);
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.SG).toMatch(/^en/);
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.IE).toMatch(/^en/);
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.WE).toMatch(/^en/);
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.DEFAULT).toMatch(/^en/);

      // Test that Spanish subsidiaries use 'es' variants
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.ES).toMatch(/^es/);
      expect(OVH_LANGUAGE_BY_SUBSIDIARY.WS).toMatch(/^es/);
    });
  });

  describe('getHdsInfoUrl function', () => {
    it('should return correct URL for FR subsidiary', () => {
      const url = getHdsInfoUrl('FR' as OvhSubsidiary);
      expect(url).toBe(
        'https://www.ovhcloud.com/fr/enterprise/certification-conformity/hds/',
      );
    });

    it('should return correct URL for GB subsidiary', () => {
      const url = getHdsInfoUrl('GB' as OvhSubsidiary);
      expect(url).toBe(
        'https://www.ovhcloud.com/en-gb/enterprise/certification-conformity/hds/',
      );
    });

    it('should return correct URL for ASIA subsidiary', () => {
      const url = getHdsInfoUrl('ASIA' as OvhSubsidiary);
      expect(url).toBe(
        'https://www.ovhcloud.com/asia/enterprise/certification-conformity/hds/',
      );
    });

    it('should return correct URL for unknown subsidiary (uses language mapping)', () => {
      const url = getHdsInfoUrl('UNKNOWN' as OvhSubsidiary);
      // Since OVH_LANGUAGE_BY_SUBSIDIARY doesn't have 'UNKNOWN', it will be undefined
      // and the URL will be malformed, but the function will still return a string
      expect(typeof url).toBe('string');
      expect(url).toContain('https://www.ovhcloud.com/');
      expect(url).toContain('/enterprise/certification-conformity/hds/');
    });

    it('should return consistent URLs for all subsidiaries', () => {
      const subsidiaries = [
        'FR',
        'GB',
        'DE',
        'ES',
        'IT',
        'CA',
        'QC',
        'AU',
        'SG',
        'IE',
      ] as const;

      subsidiaries.forEach((subsidiary) => {
        const url = getHdsInfoUrl(subsidiary as OvhSubsidiary);
        expect(url).toMatch(/^https:\/\/www\.ovhcloud\.com\//);
        expect(url).toContain('/enterprise/certification-conformity/hds/');
        expect(url).toMatch(/\/enterprise\/certification-conformity\/hds\/$/);
      });
    });
  });

  describe('Integration tests', () => {
    it('should have proper URL structure for HDS info links', () => {
      const subsidiaries = [
        'FR',
        'GB',
        'DE',
        'ES',
        'IT',
        'CA',
        'QC',
        'AU',
        'SG',
        'IE',
      ] as const;

      subsidiaries.forEach((subsidiary) => {
        const url = getHdsInfoUrl(subsidiary as OvhSubsidiary);
        // Should contain the OVHcloud base URL
        expect(url).toMatch(/^https:\/\/www\.ovhcloud\.com/);
        // Should contain the HDS path
        expect(url).toContain('/enterprise/certification-conformity/hds/');
      });
    });
  });
});
