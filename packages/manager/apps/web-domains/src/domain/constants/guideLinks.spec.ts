import { describe, it, expect } from 'vitest';
import { getRecordGuideUrl } from '@/domain/constants/guideLinks';

const docsUrl = (language: string, slug: string) =>
  `https://docs.ovhcloud.com/${language}/guides/web-cloud/domains/${slug}`;

describe('getRecordGuideUrl', () => {
  it.each([
    ['A', 'dns-zone-a-record-creation'],
    ['AAAA', 'dns-zone-aaaa-record-creation'],
    ['TXT', 'dns-zone-txt-record-creation'],
    ['MX', 'dns-zone-mx'],
    ['CNAME', 'dns-zone-cname-record-creation'],
  ])('returns the %s guide', (recordType, slug) => {
    expect(getRecordGuideUrl(recordType, 'FR')).toBe(docsUrl('fr', slug));
  });

  it.each([
    ['FR', 'fr'],
    ['MA', 'fr'],
    ['SN', 'fr'],
    ['TN', 'fr'],
    ['QC', 'fr'],
    ['DE', 'de'],
    ['ES', 'es'],
    ['LT', 'es'],
    ['IT', 'it'],
    ['PL', 'pl'],
    ['PT', 'pt'],
    ['GB', 'en'],
    ['IE', 'en'],
    ['NL', 'en'],
    ['CA', 'en'],
    ['IN', 'en'],
    ['SG', 'en'],
    ['AU', 'en'],
    ['ASIA', 'en'],
    ['WS', 'en'],
  ])('returns the %s guide in %s', (subsidiary, language) => {
    expect(getRecordGuideUrl('MX', subsidiary)).toBe(
      docsUrl(language, 'dns-zone-mx'),
    );
  });

  it.each(['DNAME', 'SRV', 'SPF', 'DKIM', 'DMARC', 'NS'])(
    'returns no guide for %s',
    (recordType) => {
      expect(getRecordGuideUrl(recordType, 'FR')).toBeUndefined();
    },
  );
});
