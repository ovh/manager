import { describe, it, expect } from 'vitest';
import { getGuideVariant, getRecordGuideUrl } from '@/zone/utils/recordGuideLinks';

describe('getGuideVariant', () => {
  it.each([
    ['de_DE', 'FR', 'de'],
    ['es_ES', 'FR', 'es-es'],
    ['it_IT', 'GB', 'it'],
    ['pl_PL', 'FR', 'pl'],
    ['pt_PT', 'FR', 'pt'],
    ['fr_FR', 'FR', 'fr'],
    ['fr_FR', 'MA', 'fr'],
    ['fr_FR', 'QC', 'fr-ca'],
    ['fr_FR', 'CA', 'fr-ca'],
    ['fr_CA', 'FR', 'fr-ca'],
    ['en_GB', 'GB', 'en-gb'],
    ['en_GB', 'IE', 'en-ie'],
    ['en_GB', 'NL', 'en-ie'],
    ['en_GB', 'IN', 'en-in'],
    ['en_GB', 'SG', 'en-sg'],
    ['en_GB', 'ASIA', 'asia'],
    ['en_GB', 'CA', 'en-ca'],
    ['en_GB', 'AU', 'en-gb'],
    ['en_GB', 'FR', 'en-gb'],
    ['nl_NL', 'NL', 'en-ie'],
    ['', 'FR', 'en-gb'],
  ])('resolves %s / %s to %s', (locale, subsidiary, expected) => {
    expect(getGuideVariant(locale, subsidiary)).toBe(expected);
  });
});

describe('getRecordGuideUrl', () => {
  it('returns the French A record guide', () => {
    expect(getRecordGuideUrl('A', 'fr_FR', 'FR')).toBe(
      'https://help.ovhcloud.com/csm/fr-dns-create-a-record?id=kb_article_view&sysparm_article=KB0067694',
    );
  });

  it('returns the German AAAA record guide', () => {
    expect(getRecordGuideUrl('AAAA', 'de_DE', 'DE')).toBe(
      'https://help.ovhcloud.com/csm/de-dns-create-aaaa-record?id=kb_article_view&sysparm_article=KB0067704',
    );
  });

  it('returns the Indian English TXT record guide', () => {
    expect(getRecordGuideUrl('TXT', 'en_GB', 'IN')).toBe(
      'https://help.ovhcloud.com/csm/en-in-dns-create-txt-record?id=kb_article_view&sysparm_article=KB0071053',
    );
  });

  it('returns the French Canadian MX record guide', () => {
    expect(getRecordGuideUrl('MX', 'fr_CA', 'QC')).toBe(
      'https://help.ovhcloud.com/csm/fr-ca-dns-configure-mx-dns-zone?id=kb_article_view&sysparm_article=KB0051706',
    );
  });

  it('falls back to the French Canadian guide when the variant has no article', () => {
    expect(getRecordGuideUrl('A', 'en_GB', 'CA')).toBe(
      'https://help.ovhcloud.com/csm/fr-ca-dns-create-a-record?id=kb_article_view&sysparm_article=KB0067692',
    );
  });

  it('returns the English guide for an unknown language', () => {
    expect(getRecordGuideUrl('MX', 'nl_NL', 'GB')).toBe(
      'https://help.ovhcloud.com/csm/en-gb-dns-configure-mx-dns-zone?id=kb_article_view&sysparm_article=KB0051697',
    );
  });

  it.each(['CNAME', 'DNAME', 'SRV', 'SPF', 'DKIM', 'DMARC', 'NS'])(
    'returns no guide for %s',
    (recordType) => {
      expect(getRecordGuideUrl(recordType, 'fr_FR', 'FR')).toBeUndefined();
    },
  );
});
