import { describe, expect, it } from 'vitest';
import {
  AddIpFormSchema,
  Ipv4HostCidrSchema,
  isDuplicateHostIp,
  toHostIp,
} from './cidr.schema';

describe('Ipv4HostCidrSchema', () => {
  it('accepts a valid /32 host CIDR', () => {
    expect(Ipv4HostCidrSchema.safeParse('192.168.1.10/32').success).toBe(true);
  });

  it('rejects a malformed value', () => {
    const result = Ipv4HostCidrSchema.safeParse('not-an-ip');
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('cidr.error.format');
  });

  it('rejects an out-of-range octet', () => {
    const result = Ipv4HostCidrSchema.safeParse('300.1.1.1/32');
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('cidr.error.octetRange');
  });

  it('rejects a mask other than /32', () => {
    const result = Ipv4HostCidrSchema.safeParse('10.0.0.0/24');
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('cidr.error.maskRange');
  });

  it('trims surrounding whitespace before validating', () => {
    expect(Ipv4HostCidrSchema.safeParse('  10.0.0.5/32  ').success).toBe(true);
  });
});

describe('toHostIp', () => {
  it('strips the /32 mask', () => {
    expect(toHostIp('10.0.0.5/32')).toBe('10.0.0.5');
  });

  it('trims whitespace', () => {
    expect(toHostIp('  10.0.0.5/32 ')).toBe('10.0.0.5');
  });
});

describe('isDuplicateHostIp', () => {
  it('detects an IP already present in the list (R8)', () => {
    expect(isDuplicateHostIp('10.0.0.5', ['192.168.1.10', '10.0.0.5'])).toBe(
      true,
    );
  });

  it('returns false for a new IP', () => {
    expect(isDuplicateHostIp('10.0.0.6', ['192.168.1.10', '10.0.0.5'])).toBe(
      false,
    );
  });
});

describe('AddIpFormSchema', () => {
  it('validates the cidr field', () => {
    expect(AddIpFormSchema.safeParse({ cidr: '192.168.1.10/32' }).success).toBe(
      true,
    );
    expect(AddIpFormSchema.safeParse({ cidr: '192.168.1.10/24' }).success).toBe(
      false,
    );
  });
});
