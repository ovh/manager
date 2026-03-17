import { describe, it, expect } from 'vitest';
import { parseSpfTarget } from '@/zone/utils/formSchema.utils';

describe('parseSpfTarget', () => {
  it('parses the default OVH SPF record', () => {
    expect(parseSpfTarget('v=spf1 include:mx.ovh.com ~all')).toEqual({
      spf_includeOvh: true,
      spf_useMx: false,
      spf_useA: false,
      spf_includesRaw: '',
      spf_ip4Raw: '',
      spf_ip6Raw: '',
      spf_policy: '~all',
      spf_unknownTokens: '',
    });
  });

  it('parses a full SPF record with all mechanisms', () => {
    const result = parseSpfTarget(
      'v=spf1 include:mx.ovh.com mx a ip4:1.2.3.4 ip6:2001:db8:: include:spf.google.com -all',
    );
    expect(result).toEqual({
      spf_includeOvh: true,
      spf_useMx: true,
      spf_useA: true,
      spf_includesRaw: 'spf.google.com',
      spf_ip4Raw: '1.2.3.4',
      spf_ip6Raw: '2001:db8::',
      spf_policy: '-all',
      spf_unknownTokens: '',
    });
  });

  it('parses multiple ip4 and ip6 addresses into newline-separated strings', () => {
    const result = parseSpfTarget(
      'v=spf1 ip4:10.0.0.1 ip4:10.0.0.2 ip6:::1 ip6:::2 ~all',
    );
    expect(result.spf_ip4Raw).toBe('10.0.0.1\n10.0.0.2');
    expect(result.spf_ip6Raw).toBe('::1\n::2');
  });

  it('parses multiple include domains into newline-separated strings', () => {
    const result = parseSpfTarget(
      'v=spf1 include:spf.google.com include:spf.protection.outlook.com ~all',
    );
    expect(result.spf_includesRaw).toBe('spf.google.com\nspf.protection.outlook.com');
    expect(result.spf_includeOvh).toBe(false);
  });

  it('defaults to ~all when no policy is present', () => {
    expect(parseSpfTarget('v=spf1 mx').spf_policy).toBe('~all');
  });

  it('parses an empty target gracefully', () => {
    expect(parseSpfTarget('')).toEqual({
      spf_includeOvh: false,
      spf_useMx: false,
      spf_useA: false,
      spf_includesRaw: '',
      spf_ip4Raw: '',
      spf_ip6Raw: '',
      spf_policy: '~all',
      spf_unknownTokens: '',
    });
  });

  it('treats bare all (no qualifier) as +all', () => {
    expect(parseSpfTarget('v=spf1 mx all').spf_policy).toBe('+all');
  });

  it('preserves parameterised mx: and a: forms in unknownTokens (different semantics from bare mx/a)', () => {
    const result = parseSpfTarget('v=spf1 mx:mail.example.com a:host.example.com ~all');
    expect(result.spf_useMx).toBe(false);
    expect(result.spf_useA).toBe(false);
    expect(result.spf_unknownTokens).toBe('mx:mail.example.com a:host.example.com');
  });

  it('preserves unsupported directives verbatim for round-trip', () => {
    const result = parseSpfTarget('v=spf1 redirect=_spf.example.com ~all');
    expect(result.spf_unknownTokens).toBe('redirect=_spf.example.com');
    expect(result.spf_policy).toBe('~all');
  });

  it('preserves multiple unknown tokens space-separated', () => {
    const result = parseSpfTarget('v=spf1 mx ptr:example.com exists:%{i}.example.com ~all');
    expect(result.spf_useMx).toBe(true);
    expect(result.spf_unknownTokens).toBe('ptr:example.com exists:%{i}.example.com');
  });
});
