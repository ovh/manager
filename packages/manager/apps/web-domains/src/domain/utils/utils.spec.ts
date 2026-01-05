import '@/common/setupTests';
import { expect, it, vi } from 'vitest';
import { useFormatDate } from '@ovh-ux/manager-react-components';
import {
  computeDnsDetails,
  getIpsSupported,
  transformIpsStringToArray,
  isDuplicateHost,
  isValidHostSyntax,
  makeHostValidators,
  isDuplicateIps,
  isValidIpv4,
  isValidIpv6,
  makeIpsValidator,
  areIPsValid,
} from './utils';
import {
  TDomainResource,
  TNameServerWithType,
} from '@/domain/types/domainResource';
import { baseDomainResource, ns1, ns2 } from '@/domain/__mocks__/dnsDetails';
import { TaskStatusEnum } from '@/domain/enum/taskStatus.enum';
import { DnsConfigurationTypeEnum } from '@/domain/enum/dnsConfigurationType.enum';
import { IpsSupportedEnum } from '@/domain/enum/hostConfiguration.enum';
import { ProtectionStateEnum } from '@/domain/enum/protectionState.enum';
import { StatusEnum } from '../enum/Status.enum';
import { useTranslation } from 'react-i18next';

vi.mock('@ovh-ux/manager-react-components', () => ({
  useFormatDate: () => () => '03/01/2025 10:15',
}));

describe('It displays the manager in the good format', () => {
  it('return the date in dd/MM/yyyy HH:mm for France', () => {
    const testDate = '2025-01-03T11:15:40.311595+01:00';
    const formatDate = useFormatDate();
    expect(formatDate({ date: testDate, format: 'P p' })).toBe(
      '03/01/2025 10:15',
    );
  });
});

describe('computeDnsDetails', () => {
  it('should mark servers as ACTIVATED when in both current and target', () => {
    const resource: TDomainResource = {
      ...baseDomainResource,
      currentState: {
        ...baseDomainResource.currentState,
        dnsConfiguration: {
          ...baseDomainResource.currentState.dnsConfiguration,
          nameServers: [ns1],
        },
      },
      targetSpec: {
        dnsConfiguration: { nameServers: [ns1] },
        protectionState: ProtectionStateEnum.PROTECTED,
      },
    };

    const result = computeDnsDetails(resource);

    expect(result).toEqual([
      {
        name: 'ns1.example.com',
        ip: '1.1.1.1',
        status: 'ENABLED',
        type: 'EXTERNAL',
      },
    ]);
  });

  it('should mark servers as ACTIVATING when only in target', () => {
    const resource: TDomainResource = {
      ...baseDomainResource,
      currentState: {
        ...baseDomainResource.currentState,
        dnsConfiguration: {
          ...baseDomainResource.currentState.dnsConfiguration,
          nameServers: [],
        },
      },
      targetSpec: {
        dnsConfiguration: { nameServers: [ns1] },
        protectionState: ProtectionStateEnum.PROTECTED,
      },
    };

    const result = computeDnsDetails(resource);

    expect(result).toEqual([
      {
        name: 'ns1.example.com',
        ip: '1.1.1.1',
        status: 'ACTIVATING',
        type: 'EXTERNAL',
      },
    ]);
  });

  it('should mark servers as ERROR when update task is in error', () => {
    const resource: TDomainResource = {
      ...baseDomainResource,
      currentState: {
        ...baseDomainResource.currentState,
        dnsConfiguration: {
          ...baseDomainResource.currentState.dnsConfiguration,
          nameServers: [],
        },
      },
      currentTasks: [
        {
          id: 'task-1',
          link: '',
          status: TaskStatusEnum.ERROR,
          type: 'DomainDnsUpdate',
        },
      ],
      targetSpec: {
        dnsConfiguration: { nameServers: [ns1] },
        protectionState: ProtectionStateEnum.PROTECTED,
      },
    };

    const result = computeDnsDetails(resource);

    expect(result).toEqual([
      {
        name: 'ns1.example.com',
        ip: '1.1.1.1',
        status: 'ERROR',
        type: 'EXTERNAL',
      },
    ]);
  });

  it('should mark servers as DELETING when only in current', () => {
    const resource: TDomainResource = {
      ...baseDomainResource,
      currentState: {
        ...baseDomainResource.currentState,
        dnsConfiguration: {
          ...baseDomainResource.currentState.dnsConfiguration,
          nameServers: [ns1],
        },
      },
      targetSpec: {
        dnsConfiguration: { nameServers: [] },
        protectionState: ProtectionStateEnum.PROTECTED,
      },
    };

    const result = computeDnsDetails(resource);

    expect(result).toEqual([
      {
        name: 'ns1.example.com',
        ip: '1.1.1.1',
        status: 'DELETING',
        type: 'EXTERNAL',
      },
    ]);
  });

  it('should handle mixed scenarios', () => {
    const resource: TDomainResource = {
      ...baseDomainResource,
      currentState: {
        ...baseDomainResource.currentState,
        dnsConfiguration: {
          ...baseDomainResource.currentState.dnsConfiguration,
          nameServers: [ns1],
        },
      },
      targetSpec: {
        dnsConfiguration: { nameServers: [ns1, ns2] },
        protectionState: ProtectionStateEnum.PROTECTED,
      },
    };

    const result = computeDnsDetails(resource);

    expect(result).toEqual([
      {
        name: 'ns1.example.com',
        ip: '1.1.1.1',
        status: 'ENABLED',
        type: 'EXTERNAL',
      },
      {
        name: 'ns2.example.com',
        ip: '2.2.2.2',
        status: 'ACTIVATING',
        type: 'EXTERNAL',
      },
    ]);
  });

  it('should fallback to "" for IP if no IP is defined', () => {
    const nsNoIP: TNameServerWithType = {
      nameServer: 'ns3.example.com',
      nameServerType: DnsConfigurationTypeEnum.EXTERNAL,
    };
    const resource: TDomainResource = {
      ...baseDomainResource,
      currentState: {
        ...baseDomainResource.currentState,
        dnsConfiguration: {
          ...baseDomainResource.currentState.dnsConfiguration,
          nameServers: [],
        },
      },
      targetSpec: {
        dnsConfiguration: { nameServers: [nsNoIP] },
        protectionState: ProtectionStateEnum.PROTECTED,
      },
    };

    const result = computeDnsDetails(resource);

    expect(result).toEqual([
      {
        name: 'ns3.example.com',
        ip: '',
        status: 'ACTIVATING',
        type: 'EXTERNAL',
      },
    ]);
  });
});

describe('getIpsSupported', () => {
  it('returns All when both ipv4 and ipv6 are supported and multiple IPs are allowed', () => {
    expect(getIpsSupported(true, true, true)).toBe(IpsSupportedEnum.All);
  });

  it('returns OneIPv4OneIPv6 when both ipv4 and ipv6 are supported but multiple IPs are not allowed', () => {
    expect(getIpsSupported(true, true, false)).toBe(
      IpsSupportedEnum.OneIPv4OrOneIPv6,
    );
  });

  it('returns MultipleIPv4 when only ipv4 is supported and multiple IPs are allowed', () => {
    expect(getIpsSupported(true, false, true)).toBe(
      IpsSupportedEnum.MultipleIPv4,
    );
  });

  it('returns OneIPv4 when only ipv4 is supported and multiple IPs are not allowed', () => {
    expect(getIpsSupported(true, false, false)).toBe(IpsSupportedEnum.OneIPv4);
  });

  it('returns MultipleIPv6 when only ipv6 is supported and multiple IPs are allowed', () => {
    expect(getIpsSupported(false, true, true)).toBe(
      IpsSupportedEnum.MultipleIPv6,
    );
  });

  it('returns OneIPv6 when only ipv6 is supported and multiple IPs are not allowed', () => {
    expect(getIpsSupported(false, true, false)).toBe(IpsSupportedEnum.OneIPv6);
  });

  it('falls back to All when neither ipv4 nor ipv6 is supported', () => {
    expect(getIpsSupported(false, false, false)).toBe(IpsSupportedEnum.All);
  });
});

describe('transformIpsStringToArray', () => {
  it('splits a comma-separated string and trims spaces', () => {
    const result = transformIpsStringToArray('1.1.1.1,  2.2.2.2 ,3.3.3.3');
    expect(result).toEqual(['1.1.1.1', '2.2.2.2', '3.3.3.3']);
  });

  it('returns array with empty string when input is empty', () => {
    const result = transformIpsStringToArray('');
    expect(result).toEqual(['']);
  });

  it('handles single IP without comma', () => {
    const result = transformIpsStringToArray('1.1.1.1');
    expect(result).toEqual(['1.1.1.1']);
  });

  it('keeps empty segments as empty strings when there are consecutive commas', () => {
    const result = transformIpsStringToArray('1.1.1.1,,2.2.2.2');
    expect(result).toEqual(['1.1.1.1', '', '2.2.2.2']);
  });
});

describe('isDuplicateHost', () => {
  const hostsTargetSpec = [
    {
      host: 'foo.example.com',
      status: StatusEnum.ACTIVATING,
      ips: ['1.1.1.1'],
    },
  ];
  it('should return true when host already exists in target spec', () => {
    expect(isDuplicateHost('foo', hostsTargetSpec, 'example.com')).toBe(true);
  });
  it('should return false when host does not exist in target spec', () => {
    expect(isDuplicateHost('bar', hostsTargetSpec, 'example.com')).toBe(false);
  });
});

describe('isValidHostSyntax', () => {
  it('should return true for valid hostname', () => {
    expect(isValidHostSyntax('valid.host', 'example.com')).toBe(true);
  });

  it('should return false for invalid hostname', () => {
    expect(isValidHostSyntax('invalid#host', 'example.com')).toBe(false);
  });
});

describe('makeHostValidators', () => {
  const hostsTargetSpec = [
    {
      host: 'foo.example.com',
      status: StatusEnum.ACTIVATING,
      ips: ['1.1.1.1'],
    },
  ];
  const { t } = useTranslation(['domain']);
  it('should create validators with correct error messages', () => {
    const validators = makeHostValidators(hostsTargetSpec, 'example.com', t);
    expect(validators.noDuplicate('bar')).toBe(true);
    expect(validators.validSyntax('invalid#host')).toBe(
      'domain_tab_hosts_drawer_add_invalid_host_format',
    );
  });
});

describe('isDuplicateIps', () => {
  it('should detect duplicate IPs', () => {
    expect(isDuplicateIps(['1.1.1.1', '1.1.1.1'])).toBe(true);
  });

  it('should return false for unique IPs', () => {
    expect(isDuplicateIps(['1.1.1.1', '2.2.2.2'])).toBe(false);
  });
});

describe('isValidIpv4', () => {
  it('should validate IPv4 addresses', () => {
    expect(isValidIpv4('192.168.1.1')).toBe(true);
    expect(isValidIpv4('invalid')).toBe(false);
  });
});

describe('isValidIpv6', () => {
  it('should validate IPv6 addresses', () => {
    expect(isValidIpv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(true);
    expect(isValidIpv6('invalid')).toBe(false);
  });
});

describe('areIPsValid', () => {
  it('should return false when no IPs are provided', () => {
    expect(areIPsValid([], IpsSupportedEnum.OneIPv4)).toBe(false);
  });

  it('should return false when more than one IP is provided for single IP support', () => {
    expect(
      areIPsValid(['192.168.1.1', '10.0.0.1'], IpsSupportedEnum.OneIPv4),
    ).toBe(false);
  });

  it('should return false when invalid IPv4 is present in MultipleIPv4', () => {
    expect(
      areIPsValid(['192.168.1.1', 'invalid'], IpsSupportedEnum.MultipleIPv4),
    ).toBe(false);
  });

  it('should return false when invalid IPv6 is present in MultipleIPv6', () => {
    expect(
      areIPsValid(
        ['2001:0db8:85a3::8a2e:0370:7334', 'invalid'],
        IpsSupportedEnum.MultipleIPv6,
      ),
    ).toBe(false);
  });

  it('should return false when mixed invalid IPs in OneIPv4OrOneIPv6', () => {
    expect(
      areIPsValid(
        ['invalid', '2001:0db8:85a3::8a2e:0370:7334'],
        IpsSupportedEnum.OneIPv4OrOneIPv6,
      ),
    ).toBe(false);
  });

  it('should return true for valid IPv4 in OneIPv4', () => {
    expect(areIPsValid(['192.168.1.1'], IpsSupportedEnum.OneIPv4)).toBe(true);
  });

  it('should return true for valid IPv6 in OneIPv6', () => {
    expect(
      areIPsValid(['2001:0db8:85a3::8a2e:0370:7334'], IpsSupportedEnum.OneIPv6),
    ).toBe(true);
  });

  it('should return true for valid mixed IPs in All mode', () => {
    expect(
      areIPsValid(
        ['192.168.1.1', '2001:0db8:85a3::8a2e:0370:7334'],
        IpsSupportedEnum.All,
      ),
    ).toBe(true);
  });

  it('should return false for invalid enum value', () => {
    // @ts-ignore
    expect(
      areIPsValid(['192.168.1.1'], 'invalid-enum' as IpsSupportedEnum),
    ).toBe(false);
  });
});

describe('makeIpsValidator', () => {
  const { t } = useTranslation(['domain']);
  it('should combine both validators for complex scenarios', () => {
    const validator = makeIpsValidator(IpsSupportedEnum.All, t);
    expect(validator.noDuplicate('192.168.1.1,192.168.1.1')).toBe(
      'domain_tab_hosts_drawer_add_duplicate_ips',
    );
    expect(validator.validIps('192.168.1.1,2001:0db8::1')).toBe(true);
    expect(validator.validIps('invalid,2001:0db8::1')).toBe(
      'domain_tab_hosts_drawer_add_invalid_ips',
    );
  });
});
