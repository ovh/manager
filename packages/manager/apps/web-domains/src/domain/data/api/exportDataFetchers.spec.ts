import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchDomainColumns,
  fetchDnssecData,
  fetchContactColumns,
} from './exportDataFetchers';
import {
  TDomainResource,
  DomainService,
  TNameServerWithType,
} from '@/domain/types/domainResource';
import { DnsConfigurationTypeEnum } from '@/domain/enum/dnsConfigurationType.enum';
import { DomainColumn, ContactColumn } from '@/domain/types/export.types';

vi.mock('@/common/data/api/common.api', () => ({
  getDomainContact: vi.fn(),
}));

vi.mock('@/domain/data/api/domainZone', () => ({
  getServiceDnssec: vi.fn(),
}));

const { getDomainContact } = await import('@/common/data/api/common.api');
const { getServiceDnssec } = await import('@/domain/data/api/domainZone');

describe('exportDataFetchers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchDomainColumns', () => {
    const mockDomain: TDomainResource = {
      id: 'example.com',
      currentState: {
        dnsConfiguration: {
          configurationType: DnsConfigurationTypeEnum.ANYCAST,
          nameServers: [
            { nameServer: 'ns1.example.com' } as TNameServerWithType,
            { nameServer: 'ns2.example.com' } as TNameServerWithType,
          ],
        },
      },
    } as TDomainResource;

    const mockDomainServices: DomainService = {
      expirationDate: '2026-12-31',
      lastUpdate: '2024-01-01',
    } as DomainService;

    it('should fetch domain column', async () => {
      const columns: DomainColumn[] = ['domain'];

      const result = await fetchDomainColumns(
        mockDomain,
        mockDomainServices,
        columns,
      );

      expect(result).toEqual({
        domain: 'example.com',
      });
    });

    it('should fetch domain-utf8 column', async () => {
      const domain = {
        ...mockDomain,
        id: 'xn--exemple-fta.fr', // été-exemple.fr in punycode
      } as TDomainResource;
      const columns: DomainColumn[] = ['domain-utf8'];

      const result = await fetchDomainColumns(
        domain,
        mockDomainServices,
        columns,
      );

      expect(result['domain utf-8']).toBeDefined();
    });

    it('should fetch expiration column', async () => {
      const columns: DomainColumn[] = ['expiration'];

      const result = await fetchDomainColumns(
        mockDomain,
        mockDomainServices,
        columns,
      );

      expect(result).toEqual({
        expiration: '2026-12-31',
      });
    });

    it('should fetch creation column', async () => {
      const columns: DomainColumn[] = ['creation'];

      const result = await fetchDomainColumns(
        mockDomain,
        mockDomainServices,
        columns,
      );

      expect(result).toEqual({
        creation: '2024-01-01',
      });
    });

    it('should fetch dns-server column', async () => {
      const columns: DomainColumn[] = ['dns-server'];

      const result = await fetchDomainColumns(
        mockDomain,
        mockDomainServices,
        columns,
      );

      expect(result).toEqual({
        'dns-server': 'ns1.example.com, ns2.example.com',
      });
    });

    it('should fetch dns-type column', async () => {
      const columns: DomainColumn[] = ['dns-type'];

      const result = await fetchDomainColumns(
        mockDomain,
        mockDomainServices,
        columns,
      );

      expect(result).toEqual({
        'dns-type': DnsConfigurationTypeEnum.ANYCAST,
      });
    });

    it('should fetch dns-anycast column as true when type is ANYCAST', async () => {
      const columns: DomainColumn[] = ['dns-anycast'];

      const result = await fetchDomainColumns(
        mockDomain,
        mockDomainServices,
        columns,
      );

      expect(result).toEqual({
        'dns-anycast': 'true',
      });
    });

    it('should fetch dns-anycast column as false when type is not ANYCAST', async () => {
      const domain = {
        ...mockDomain,
        currentState: {
          dnsConfiguration: {
            configurationType: DnsConfigurationTypeEnum.HOSTING,
          },
        },
      } as TDomainResource;
      const columns: DomainColumn[] = ['dns-anycast'];

      const result = await fetchDomainColumns(
        domain,
        mockDomainServices,
        columns,
      );

      expect(result).toEqual({
        'dns-anycast': 'false',
      });
    });

    it('should fetch multiple columns at once', async () => {
      const columns: DomainColumn[] = ['domain', 'expiration', 'dns-server'];

      const result = await fetchDomainColumns(
        mockDomain,
        mockDomainServices,
        columns,
      );

      expect(result).toEqual({
        domain: 'example.com',
        expiration: '2026-12-31',
        'dns-server': 'ns1.example.com, ns2.example.com',
      });
    });

    it('should handle missing domainServices', async () => {
      const columns: DomainColumn[] = ['expiration', 'creation'];

      const result = await fetchDomainColumns(mockDomain, undefined, columns);

      expect(result).toEqual({
        expiration: '',
        creation: '',
      });
    });

    it('should handle domain without nameServers', async () => {
      const domain = {
        id: 'example.com',
        currentState: {
          dnsConfiguration: {},
        },
      } as TDomainResource;
      const columns: DomainColumn[] = ['dns-server'];

      const result = await fetchDomainColumns(
        domain,
        mockDomainServices,
        columns,
      );

      expect(result).toEqual({
        'dns-server': '',
      });
    });

    it('should return empty object for empty columns array', async () => {
      const result = await fetchDomainColumns(
        mockDomain,
        mockDomainServices,
        [],
      );

      expect(result).toEqual({});
    });
  });

  describe('fetchDnssecData', () => {
    it('should return DNSSEC status when successful', async () => {
      vi.mocked(getServiceDnssec).mockResolvedValue({
        status: 'enabled',
      } as any);

      const result = await fetchDnssecData('example.com');

      expect(result).toBe('enabled');
      expect(getServiceDnssec).toHaveBeenCalledWith('example.com');
    });

    it('should return empty string when DNSSEC status is missing', async () => {
      vi.mocked(getServiceDnssec).mockResolvedValue({} as any);

      const result = await fetchDnssecData('example.com');

      expect(result).toBe('');
    });

    it('should return empty string when API call fails', async () => {
      vi.mocked(getServiceDnssec).mockRejectedValue(new Error('API Error'));

      const result = await fetchDnssecData('example.com');

      expect(result).toBe('');
    });
  });

  describe('fetchContactColumns', () => {
    const mockDomain: TDomainResource = {
      id: 'example.com',
      currentState: {
        contactsConfiguration: {
          contactOwner: { id: 'owner123' },
          contactAdministrator: { id: 'admin456' },
          contactTechnical: { id: 'tech789' },
          contactBilling: { id: 'billing012' },
        },
      },
    } as any;

    it('should fetch owner contact with full details', async () => {
      vi.mocked(getDomainContact).mockResolvedValue({
        firstName: 'John',
        lastName: 'Doe',
        organisationName: 'ACME Corp',
        email: 'john@example.com',
        phone: '+33123456789',
        address: {
          line1: '123 Main St',
          city: 'Paris',
          country: 'FR',
        },
      } as any);

      const columns: ContactColumn[] = ['owner'];

      const result = await fetchContactColumns(mockDomain, columns);

      expect(result['Contact owner']).toContain('ACME Corp');
      expect(result['Contact owner']).toContain('Doe');
      expect(result['Contact owner']).toContain('john@example.com');
      expect(getDomainContact).toHaveBeenCalledWith('owner123');
    });

    it('should use firstName when organisationName is missing', async () => {
      vi.mocked(getDomainContact).mockResolvedValue({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '+33987654321',
        address: {},
      } as any);

      const columns: ContactColumn[] = ['owner'];

      const result = await fetchContactColumns(mockDomain, columns);

      expect(result['Contact owner']).toContain('Jane');
      expect(result['Contact owner']).toContain('Smith');
    });

    it('should return contactId for non-owner contacts', async () => {
      const columns: ContactColumn[] = ['admin', 'tech', 'billing'];

      const result = await fetchContactColumns(mockDomain, columns);

      expect(result).toEqual({
        'Contact admin': 'admin456',
        'Contact tech': 'tech789',
        'Contact billing': 'billing012',
      });
      expect(getDomainContact).not.toHaveBeenCalled();
    });

    it('should fetch multiple contact columns', async () => {
      vi.mocked(getDomainContact).mockResolvedValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+33123456789',
        address: {},
      } as any);

      const columns: ContactColumn[] = ['owner', 'admin'];

      const result = await fetchContactColumns(mockDomain, columns);

      expect(result['Contact owner']).toBeDefined();
      expect(result['Contact admin']).toBe('admin456');
    });

    it('should handle missing contact ID', async () => {
      const domain = {
        currentState: {
          contactsConfiguration: {
            contactOwner: undefined,
          },
        },
      } as any;

      const columns: ContactColumn[] = ['owner'];

      const result = await fetchContactColumns(domain, columns);

      expect(result['Contact owner']).toBe('');
    });

    it('should handle API error for owner contact', async () => {
      vi.mocked(getDomainContact).mockRejectedValue(new Error('API Error'));

      const columns: ContactColumn[] = ['owner'];

      const result = await fetchContactColumns(mockDomain, columns);

      expect(result['Contact owner']).toBe('owner123');
    });

    it('should return empty object for empty columns array', async () => {
      const result = await fetchContactColumns(mockDomain, []);

      expect(result).toEqual({});
    });

    it('should return empty object when columns is undefined', async () => {
      const result = await fetchContactColumns(mockDomain, null as any);

      expect(result).toEqual({});
    });
  });
});
