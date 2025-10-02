import { describe, expect, it } from 'vitest';

import { parseSRVRecord } from './domains';

describe('parseSRVRecord', () => {
  it('parses a minimal SRV record (no TTL, domain)', () => {
    const record = '_autodiscover._tcp IN SRV 0 0 443 zimbra1.mail.ovh.net.';
    const result = parseSRVRecord(record);

    expect(result).toEqual({
      subdomain: '_autodiscover._tcp',
      priority: 0,
      weight: 0,
      port: 443,
      target: 'zimbra1.mail.ovh.net',
    });
  });

  it('throws an error if SRV keyword is missing', () => {
    const record = '_autodiscover._tcp IN TXT 0 0 443 mail.example.com.';
    expect(() => parseSRVRecord(record)).toThrowError('Invalid SRV record format');
  });

  it('throws an error if there are not enough fields after SRV', () => {
    const record = '_autodiscover._tcp IN SRV 0 0';
    expect(() => parseSRVRecord(record)).toThrowError('Invalid SRV record format');
  });
});
