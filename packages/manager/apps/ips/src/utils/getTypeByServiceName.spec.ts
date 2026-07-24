import { describe, expect, it } from 'vitest';

import { IpTypeEnum } from '@/data/constants';

import { getTypeByServiceName } from './getTypeByServiceName';

describe('getTypeByServiceName', () => {
  it.each([
    [null, null],
    [undefined, null],
    ['', null],
    ['ns123456.ip-239-99-244.net', IpTypeEnum.DEDICATED],
    ['pcc-123-456', IpTypeEnum.PCC],
    ['0123456789abcdef0123456789abcdef', IpTypeEnum.CLOUD],
    ['vps-123456.vps.ovh.net', IpTypeEnum.VPS],
    ['pn-1234567', IpTypeEnum.VRACK],
    ['loadbalancer-abc123', IpTypeEnum.LOAD_BALANCING],
    ['org-abc123', IpTypeEnum.VCFAAS],
    ['unknown-service', null],
  ])('should map "%s" to %s', (serviceName, expected) => {
    expect(getTypeByServiceName(serviceName)).toBe(expected);
  });
});
