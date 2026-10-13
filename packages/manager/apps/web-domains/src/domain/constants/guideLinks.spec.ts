import { describe, it, expect } from 'vitest';
import { getRecordGuideUrl } from '@/domain/constants/guideLinks';

const helpUrl = (slug: string, article: string) =>
  `https://help.ovhcloud.com/csm/${slug}?id=kb_article_view&sysparm_article=${article}`;

const CNAME_PATH = 'guides/web-cloud/domains/dns-zone-cname-record-creation';

describe('getRecordGuideUrl', () => {
  it.each([
    ['A', 'FR', helpUrl('fr-dns-create-a-record', 'KB0067694')],
    ['A', 'QC', helpUrl('fr-ca-dns-create-a-record', 'KB0067692')],
    ['AAAA', 'DE', helpUrl('de-dns-create-aaaa-record', 'KB0067704')],
    ['AAAA', 'CA', helpUrl('en-ca-dns-create-aaaa-record', 'KB0067701')],
    ['TXT', 'IN', helpUrl('en-in-dns-create-txt-record', 'KB0071053')],
    ['TXT', 'GB', helpUrl('en-gb-dns-create-txt-record', 'KB0071061')],
    ['MX', 'SG', helpUrl('en-sg-dns-configure-mx-dns-zone', 'KB0051693')],
    ['MX', 'ASIA', helpUrl('asia-dns-configure-mx-dns-zone', 'KB0051688')],
    ['MX', 'MA', helpUrl('fr-dns-configure-mx-dns-zone', 'KB0051707')],
  ])('returns the %s guide for %s', (recordType, subsidiary, expected) => {
    expect(getRecordGuideUrl(recordType, subsidiary)).toBe(expected);
  });

  it('falls back to the default article when the subsidiary has none', () => {
    expect(getRecordGuideUrl('A', 'CA')).toBe(
      helpUrl('en-ca-dns-create-a-record', 'KB0067684'),
    );
    expect(getRecordGuideUrl('TXT', 'ASIA')).toBe(
      helpUrl('asia-dns-create-txt-record', 'KB0071058'),
    );
  });

  it('falls back to the default subsidiary when it is unknown', () => {
    expect(getRecordGuideUrl('MX', 'WS')).toBe(
      helpUrl('en-ie-dns-configure-mx-dns-zone', 'KB0051691'),
    );
  });

  it.each([
    ['FR', 'fr'],
    ['QC', 'fr'],
    ['DE', 'de'],
    ['ES', 'es'],
    ['LT', 'es'],
    ['IT', 'it'],
    ['PL', 'pl'],
    ['PT', 'pt'],
    ['GB', 'en'],
    ['IN', 'en'],
    ['ASIA', 'en'],
  ])('returns the %s CNAME guide in %s', (subsidiary, docsLanguage) => {
    expect(getRecordGuideUrl('CNAME', subsidiary)).toBe(
      `https://docs.ovhcloud.com/${docsLanguage}/${CNAME_PATH}`,
    );
  });

  it.each(['DNAME', 'SRV', 'SPF', 'DKIM', 'DMARC', 'NS'])(
    'returns no guide for %s',
    (recordType) => {
      expect(getRecordGuideUrl(recordType, 'FR')).toBeUndefined();
    },
  );
});
