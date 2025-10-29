import '@/common/setupTests';
import { expect, it, vi } from 'vitest';
import { useFormatDate } from '@ovh-ux/manager-react-components';
import { getLanguageKey, computeDnsDetails } from './utils';
import {
  TDomainResource,
  TNameServerWithType,
} from '@/domain/types/domainResource';
import { baseDomainResource, ns1, ns2 } from '@/domain/__mocks__/dnsDetails';
import { TaskStatusEnum } from '../enum/taskStatus.enum';
import { DnsConfigurationTypeEnum } from '../enum/dnsConfigurationType.enum';

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

describe('getLanguageKey', () => {
  it('should return a known language code in uppercase', () => {
    expect(getLanguageKey('fr')).toBe('FR');
    expect(getLanguageKey('en')).toBe('EN');
  });

  it('should handle dash and underscore variants correctly', () => {
    expect(getLanguageKey('fr-FR')).toBe('FR');
    expect(getLanguageKey('en_GB')).toBe('EN');
  });

  it('should return DEFAULT for unsupported languages', () => {
    expect(getLanguageKey('jp')).toBe('DEFAULT');
    expect(getLanguageKey('ru-RU')).toBe('DEFAULT');
  });

  it('should be case-insensitive', () => {
    expect(getLanguageKey('Fr')).toBe('FR');
    expect(getLanguageKey('eN_gB')).toBe('EN');
  });

  it('should return DEFAULT for empty or invalid input', () => {
    expect(getLanguageKey('')).toBe('DEFAULT');
    expect(getLanguageKey('123')).toBe('DEFAULT');
    expect(getLanguageKey('---')).toBe('DEFAULT');
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
