/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import {
  DOC_BASE_URL,
  OVH_LANGUAGE_BY_SUBSIDIARY,
  getHdsInfoUrl,
  getDocumentationGuideLink,
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

  describe('getDocumentationGuideLink function', () => {
    const testGuides = [
      'getting_started',
      'public_cloud',
      'instances',
      'billing',
      'guides',
    ];
    const testSubsidiaries = [
      'DEFAULT',
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
      'PL',
      'PT',
      'NL',
      'MA',
      'SN',
      'TN',
      'ASIA',
      'WE',
      'WS',
      'IN',
    ] as const;

    describe('Special case: guides', () => {
      it('should return csm_index URL for guides guide', () => {
        const url = getDocumentationGuideLink('guides', 'FR' as OvhSubsidiary);
        expect(url).toBe(`${DOC_BASE_URL}/fr-home?id=csm_index`);
      });

      it('should return correct csm_index URLs for all subsidiaries', () => {
        testSubsidiaries.forEach((subsidiary) => {
          const url = getDocumentationGuideLink(
            'guides',
            subsidiary as OvhSubsidiary,
          );
          const language = OVH_LANGUAGE_BY_SUBSIDIARY[subsidiary];
          expect(url).toBe(`${DOC_BASE_URL}/${language}-home?id=csm_index`);
        });
      });
    });

    describe('KB Article guides', () => {
      it('should return correct URL for getting_started guide', () => {
        const url = getDocumentationGuideLink(
          'getting_started',
          'FR' as OvhSubsidiary,
        );
        expect(url).toBe(
          `${DOC_BASE_URL}/fr-public-cloud-compute-essential-information?id=kb_article_view&sysparm_article=KB0050407`,
        );
      });

      it('should return correct URL for public_cloud guide', () => {
        const url = getDocumentationGuideLink(
          'public_cloud',
          'GB' as OvhSubsidiary,
        );
        expect(url).toBe(
          `${DOC_BASE_URL}/en-gb-public-cloud-compute-control-panel?id=kb_article_view&sysparm_article=KB0050399`,
        );
      });

      it('should return correct URL for instances guide', () => {
        const url = getDocumentationGuideLink(
          'instances',
          'DE' as OvhSubsidiary,
        );
        expect(url).toBe(
          `${DOC_BASE_URL}/de-public-cloud-compute-getting-started-instance?id=kb_article_view&sysparm_article=KB0050755`,
        );
      });

      it('should return correct URL for billing guide', () => {
        const url = getDocumentationGuideLink('billing', 'ES' as OvhSubsidiary);
        expect(url).toBe(
          `${DOC_BASE_URL}/es-es-public-cloud-compute-billing-options?id=kb_article_view&sysparm_article=KB0050457`,
        );
      });

      it('should fallback to DEFAULT when subsidiary not found', () => {
        const url = getDocumentationGuideLink(
          'getting_started',
          'UNKNOWN' as OvhSubsidiary,
        );
        // Should use DEFAULT KB ID (KB0050388) and unknown language
        expect(url).toContain('public-cloud-compute-essential-information');
        expect(url).toContain('sysparm_article=KB0050388');
      });
    });

    describe('URL structure validation', () => {
      it('should have correct URL structure for all KB article guides', () => {
        const kbGuides = [
          'getting_started',
          'public_cloud',
          'instances',
          'billing',
        ];

        kbGuides.forEach((guide) => {
          testSubsidiaries.forEach((subsidiary) => {
            const url = getDocumentationGuideLink(
              guide,
              subsidiary as OvhSubsidiary,
            );

            // Should start with DOC_BASE_URL
            expect(url).toMatch(/^https:\/\/help\.ovhcloud\.com\/csm\//);

            // Should contain language prefix
            const language = OVH_LANGUAGE_BY_SUBSIDIARY[subsidiary];
            expect(url).toContain(`/${language}-`);

            // Should contain guide-specific path
            const expectedPaths: Record<string, string> = {
              getting_started: 'public-cloud-compute-essential-information',
              public_cloud: 'public-cloud-compute-control-panel',
              instances: 'public-cloud-compute-getting-started-instance',
              billing: 'public-cloud-compute-billing-options',
            };
            expect(url).toContain(expectedPaths[guide]);

            // Should contain KB article parameters
            expect(url).toContain('?id=kb_article_view&sysparm_article=');
            expect(url).toMatch(/sysparm_article=KB\d+/);
          });
        });
      });
    });

    describe('Specific KB ID validation', () => {
      it('should use correct KB IDs for getting_started guide', () => {
        const expectedKBs = {
          DEFAULT: 'KB0050388',
          FR: 'KB0050407',
          DE: 'KB0050383',
          ES: 'KB0050389',
          IT: 'KB0050404',
          PL: 'KB0050394',
          PT: 'KB0050395',
          CA: 'KB0050398',
          QC: 'KB0050397',
          WS: 'KB0050392',
          AU: 'KB0038069',
          IN: 'KB0069446',
          SG: 'KB0050393',
          ASIA: 'KB0050384',
        };

        Object.entries(expectedKBs).forEach(([subsidiary, expectedKB]) => {
          const url = getDocumentationGuideLink(
            'getting_started',
            subsidiary as OvhSubsidiary,
          );
          expect(url).toContain(`sysparm_article=${expectedKB}`);
        });
      });

      it('should use correct KB IDs for public_cloud guide', () => {
        const expectedKBs = {
          DEFAULT: 'KB0050399',
          FR: 'KB0050409',
          DE: 'KB0050396',
          ES: 'KB0050416',
          IT: 'KB0050403',
          PL: 'KB0050406',
          PT: 'KB0050411',
          CA: 'KB0050400',
          QC: 'KB0050408',
          WS: 'KB0050417',
          AU: 'KB0050410',
          IN: 'KB0069451',
          SG: 'KB0050402',
          ASIA: 'KB0038083',
        };

        Object.entries(expectedKBs).forEach(([subsidiary, expectedKB]) => {
          const url = getDocumentationGuideLink(
            'public_cloud',
            subsidiary as OvhSubsidiary,
          );
          expect(url).toContain(`sysparm_article=${expectedKB}`);
        });
      });

      it('should use correct KB IDs for instances guide', () => {
        const expectedKBs = {
          DEFAULT: 'KB0050758',
          FR: 'KB0050764',
          DE: 'KB0050755',
          ES: 'KB0050761',
          IT: 'KB0050765',
          PL: 'KB0050768',
          PT: 'KB0050776',
          CA: 'KB0050754',
          QC: 'KB0050762',
          WS: 'KB0050760',
          AU: 'KB0050756',
          IN: 'KB0069231',
          SG: 'KB0050759',
          ASIA: 'KB0038462',
        };

        Object.entries(expectedKBs).forEach(([subsidiary, expectedKB]) => {
          const url = getDocumentationGuideLink(
            'instances',
            subsidiary as OvhSubsidiary,
          );
          expect(url).toContain(`sysparm_article=${expectedKB}`);
        });
      });

      it('should use correct KB IDs for billing guide', () => {
        const expectedKBs = {
          DEFAULT: 'KB0050453',
          FR: 'KB0050459',
          DE: 'KB0050448',
          ES: 'KB0050457',
          IT: 'KB0050461',
          PL: 'KB0050472',
          PT: 'KB0050474',
          CA: 'KB0050452',
          QC: 'KB0050460',
          WS: 'KB0050462',
          AU: 'KB0038140',
          IN: 'KB0069450',
          SG: 'KB0050465',
          ASIA: 'KB0050463',
        };

        Object.entries(expectedKBs).forEach(([subsidiary, expectedKB]) => {
          const url = getDocumentationGuideLink(
            'billing',
            subsidiary as OvhSubsidiary,
          );
          expect(url).toContain(`sysparm_article=${expectedKB}`);
        });
      });
    });

    describe('Language consistency', () => {
      it('should use correct language codes for all subsidiaries', () => {
        testSubsidiaries.forEach((subsidiary) => {
          const language = OVH_LANGUAGE_BY_SUBSIDIARY[subsidiary];

          // Test with a KB article guide
          const url = getDocumentationGuideLink(
            'getting_started',
            subsidiary as OvhSubsidiary,
          );
          expect(url).toContain(`/${language}-`);

          // Test with guides (csm_index)
          const guidesUrl = getDocumentationGuideLink(
            'guides',
            subsidiary as OvhSubsidiary,
          );
          expect(guidesUrl).toContain(`/${language}-home?id=csm_index`);
        });
      });
    });

    describe('Edge cases', () => {
      it('should handle unknown guide names gracefully', () => {
        const url = getDocumentationGuideLink(
          'unknown_guide',
          'FR' as OvhSubsidiary,
        );
        // Should still return a URL structure, but with undefined path
        expect(url).toMatch(/^https:\/\/help\.ovhcloud\.com\/csm\//);
        expect(url).toContain('/fr-');
        expect(url).toContain('?id=kb_article_view&sysparm_article=undefined');
      });

      it('should handle all guide types', () => {
        testGuides.forEach((guide) => {
          const url = getDocumentationGuideLink(guide, 'FR' as OvhSubsidiary);
          expect(typeof url).toBe('string');
          expect(url.length).toBeGreaterThan(0);
          expect(url).toMatch(/^https:\/\/help\.ovhcloud\.com\/csm\//);
        });
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
