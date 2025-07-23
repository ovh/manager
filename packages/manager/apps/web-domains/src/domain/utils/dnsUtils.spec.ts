import {
  isIncluded,
  transformCurrent,
  transformTarget,
  computeActiveConfiguration,
} from './dnsUtils';
import { NameServerStatusEnum } from '@/domain/enum/nameServerStatus.enum';
import { PublicNameServerTypeEnum } from '@/domain/enum/publicNameServerType.enum';
import {
  ActiveConfigurationTypeEnum,
  DnsConfigurationTypeEnum,
} from '@/domain/enum/dnsConfigurationType.enum';
import {
  ns1,
  baseDomainResource,
  domainZoneMock,
} from '@/domain/__mocks__/dnsDetails';

describe('isIncluded', () => {
  it('should return true when nameServer, ipv4, and ipv6 match', () => {
    const list = [ns1];
    expect(isIncluded(list, ns1)).toBe(true);
  });

  it('should return false if nameServer matches but IPs differ', () => {
    const modified = { ...ns1, ipv4: '9.9.9.9' };
    const list = [ns1];
    expect(isIncluded(list, modified)).toBe(false);
  });

  it('should return false for empty list', () => {
    expect(isIncluded([], ns1)).toBe(false);
  });
});

describe('transformCurrent', () => {
  it('should transform a nameserver into TDatagridDnsDetails with correct status and type', () => {
    const result = transformCurrent(ns1, NameServerStatusEnum.ENABLED);
    expect(result).toEqual({
      name: ns1.nameServer,
      ip: ns1.ipv4,
      status: 'ENABLED',
      type: 'EXTERNAL',
    });
  });

  it('should default to STANDARD if type is invalid', () => {
    const invalid = { ...ns1, nameServerType: 'UNKNOWN' as any };
    const result = transformCurrent(invalid, NameServerStatusEnum.ENABLED);
    expect(result.type).toBe('STANDARD');
  });

  it('should fallback to ipv6 or empty if no ipv4 is provided', () => {
    const withIPv6Only = {
      nameServer: 'ns.ipv6.test',
      ipv6: '2001:db8::1',
      nameServerType: DnsConfigurationTypeEnum.EMPTY,
    };
    const result = transformCurrent(
      withIPv6Only,
      NameServerStatusEnum.ACTIVATING,
    );
    expect(result.ip).toBe('2001:db8::1');
  });

  it('should fallback to empty string if no IP is provided', () => {
    const noIp = { nameServer: 'ns.noip.com', nameServerType: 'EXTERNAL' };
    const result = transformCurrent(noIp as any, NameServerStatusEnum.DELETING);
    expect(result.ip).toBe('');
  });
});

describe('transformTarget', () => {
  it('should guess type and return correct structure', () => {
    const basic = {
      nameServer: 'dns103.ovh.net',
      ipv4: '192.0.2.2',
    };
    const result = transformTarget(basic, NameServerStatusEnum.ENABLED);
    expect(result).toEqual({
      name: 'dns103.ovh.net',
      ip: '192.0.2.2',
      status: 'ENABLED',
      type: 'STANDARD',
    });
  });

  it('should fallback to empty string IP if none provided', () => {
    const noIp = { nameServer: 'dns.any.net' };
    const result = transformTarget(noIp, NameServerStatusEnum.ACTIVATING);
    expect(result.ip).toBe('');
  });

  it('should detect ANYCAST type based on pattern', () => {
    const anycast = { nameServer: 'dns300.anycast.me' };
    const result = transformTarget(anycast, NameServerStatusEnum.ACTIVATING);
    expect(result.type).toBe(PublicNameServerTypeEnum.ANYCAST);
  });

  it('should detect DEDICATED type based on pattern', () => {
    const dedicated = { nameServer: 'sdns1.ovh.net' };
    const result = transformTarget(dedicated, NameServerStatusEnum.ENABLED);
    expect(result.type).toBe(PublicNameServerTypeEnum.DEDICATED);
  });
});

describe('computeActiveConfiguration', () => {
  it('should return EXTERNAL if domainZone is not defined', () => {
    const result = computeActiveConfiguration(baseDomainResource);
    expect(result).toBe(ActiveConfigurationTypeEnum.EXTERNAL);
  });

  it('should return EXTERNAL if configurationType is EXTERNAL', () => {
    const resource = {
      ...baseDomainResource,
      currentState: {
        ...baseDomainResource.currentState,
        dnsConfiguration: {
          ...baseDomainResource.currentState.dnsConfiguration,
          configurationType: DnsConfigurationTypeEnum.EXTERNAL,
        },
      },
    };
    const result = computeActiveConfiguration(resource, domainZoneMock);
    expect(result).toBe(ActiveConfigurationTypeEnum.EXTERNAL);
  });

  it('should return MIXED if configurationType is MIXED', () => {
    const resource = {
      ...baseDomainResource,
      currentState: {
        ...baseDomainResource.currentState,
        dnsConfiguration: {
          ...baseDomainResource.currentState.dnsConfiguration,
          configurationType: DnsConfigurationTypeEnum.MIXED,
        },
      },
    };
    const result = computeActiveConfiguration(resource, domainZoneMock);
    expect(result).toBe(ActiveConfigurationTypeEnum.MIXED);
  });

  it('should return INTERNAL if configurationType is something else', () => {
    const resource = {
      ...baseDomainResource,
      currentState: {
        ...baseDomainResource.currentState,
        dnsConfiguration: {
          ...baseDomainResource.currentState.dnsConfiguration,
          configurationType: DnsConfigurationTypeEnum.HOSTING,
        },
      },
    };
    const result = computeActiveConfiguration(resource, domainZoneMock);
    expect(result).toBe(ActiveConfigurationTypeEnum.INTERNAL);
  });

  it('should return EXTERNAL if there is no internal DNS zone', () => {
    const result = computeActiveConfiguration(baseDomainResource);
    expect(result).toBe(ActiveConfigurationTypeEnum.EXTERNAL);
  });
});
