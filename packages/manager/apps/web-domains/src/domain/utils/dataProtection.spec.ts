import { describe, expect, it } from 'vitest';
import {
  dataProtectionStatus,
  translateContactType,
  translateContactField,
} from './dataProtection';
import {
  DataProtectionStatus,
  DisclosureConfigurationEnum,
  TDomainResource,
  DataProtectionFieldEnum,
} from '@/domain/types/domainResource';
import { DnsConfigurationTypeEnum } from '@/domain/enum/dnsConfigurationType.enum';
import { DomainStateEnum } from '@/domain/enum/domainState.enum';
import { ProtectionStateEnum } from '@/domain/enum/protectionState.enum';
import { SuspensionStateEnum } from '@/domain/enum/suspensionState.enum';
import { ResourceStatusEnum } from '@/domain/enum/resourceStatus.enum';
import { supportedAlgorithms } from '../constants/dsRecords';

const createMockDomainResource = (
  contactsConfig: TDomainResource['currentState']['contactsConfiguration'],
): TDomainResource => ({
  checksum: 'checksum-value',
  currentState: {
    additionalStates: [],
    dnsConfiguration: {
      configurationType: DnsConfigurationTypeEnum.HOSTING,
      glueRecordIPv6Supported: true,
      hostSupported: true,
      maxDNS: 10,
      minDNS: 2,
      nameServers: [],
      dnssecSupported: true,
    },
    hostsConfiguration: {
      ipv4Supported: true,
      ipv6Supported: true,
      multipleIPsSupported: true,
      hostSupported: true,
      hosts: [],
    },
    dnssecConfiguration: {
      dnssecSupported: true,
      supportedAlgorithms,
      dsData: [
        {
          algorithm: 8,
          keyTag: 0,
          flags: 0,
          publicKey:
            'MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgGlVDb17VQPrH7bOLBGc6N+/D84tbly3RQ/kQLPq73H6nhCI+vg1euNvnZaFBDiHktGRDlmayzoo5k/j/65V5TkoFE/x5yaiPGHXKIb+QsZCbHeNkEx/di4meHY7sETyla97uBM5BJUBc7ZhCoR2+Jc+HHdBLrQ5/9LpR0nEsfn7AgMBAAE=',
        },
      ],
    },
    extension: '.com',
    mainState: DomainStateEnum.OK,
    name: 'example.com',
    protectionState: ProtectionStateEnum.PROTECTED,
    suspensionState: SuspensionStateEnum.NOT_SUSPENDED,
    authInfoManagedByOVHcloud: true,
    authInfoSupported: true,
    contactsConfiguration: contactsConfig,
    createdAt: '2024-01-01T00:00:00Z',
  },
  currentTasks: [],
  iam: null,
  id: 'domain-id',
  resourceStatus: ResourceStatusEnum.READY,
  targetSpec: {
    protectionState: ProtectionStateEnum.PROTECTED,
  },
});

describe('dataProtection utilities', () => {
  describe('dataProtectionStatus', () => {
    it('should return NONE when no contacts exist', () => {
      const domainResource = createMockDomainResource({
        contactOwner: { id: 'owner-id' },
        contactAdministrator: { id: 'admin-id' },
        contactTechnical: { id: 'tech-id' },
        contactBilling: { id: 'billing-id' },
      });

      domainResource.currentState.contactsConfiguration = {} as any;

      const status = dataProtectionStatus(domainResource);
      expect(status).toBe(DataProtectionStatus.NONE);
    });

    it('should return DISABLED when any contact has forceDisclosure', () => {
      const domainResource = createMockDomainResource({
        contactOwner: {
          id: 'owner-id',
          disclosurePolicy: {
            disclosureConfiguration: DisclosureConfigurationEnum.DISCLOSED,
            forcedDisclosureConfiguration: true,
            disclosedFields: [],
            visibleViaRdds: true,
          },
        },
        contactAdministrator: {
          id: 'admin-id',
          disclosurePolicy: {
            disclosureConfiguration: DisclosureConfigurationEnum.REDACTED,
            forcedDisclosureConfiguration: false,
            disclosedFields: [],
            visibleViaRdds: true,
          },
        },
        contactTechnical: { id: 'tech-id' },
        contactBilling: { id: 'billing-id' },
      });

      const status = dataProtectionStatus(domainResource);
      expect(status).toBe(DataProtectionStatus.DISABLED);
    });

    it('should return NONE when no visible contacts', () => {
      const domainResource = createMockDomainResource({
        contactOwner: {
          id: 'owner-id',
          disclosurePolicy: {
            disclosureConfiguration: DisclosureConfigurationEnum.REDACTED,
            forcedDisclosureConfiguration: false,
            disclosedFields: [],
            visibleViaRdds: false,
          },
        },
        contactAdministrator: { id: 'admin-id' },
        contactTechnical: { id: 'tech-id' },
        contactBilling: { id: 'billing-id' },
      });

      const status = dataProtectionStatus(domainResource);
      expect(status).toBe(DataProtectionStatus.NONE);
    });

    it('should return NONE when no redacted contacts among visible ones', () => {
      const domainResource = createMockDomainResource({
        contactOwner: {
          id: 'owner-id',
          disclosurePolicy: {
            disclosureConfiguration: DisclosureConfigurationEnum.DISCLOSED,
            forcedDisclosureConfiguration: false,
            disclosedFields: ['EMAIL'],
            visibleViaRdds: true,
          },
        },
        contactAdministrator: {
          id: 'admin-id',
          disclosurePolicy: {
            disclosureConfiguration: DisclosureConfigurationEnum.DISCLOSED,
            forcedDisclosureConfiguration: false,
            disclosedFields: ['PHONE'],
            visibleViaRdds: true,
          },
        },
        contactTechnical: { id: 'tech-id' },
        contactBilling: { id: 'billing-id' },
      });

      const status = dataProtectionStatus(domainResource);
      expect(status).toBe(DataProtectionStatus.NONE);
    });

    it('should return ACTIVE when all visible contacts are redacted', () => {
      const domainResource = createMockDomainResource({
        contactOwner: {
          id: 'owner-id',
          disclosurePolicy: {
            disclosureConfiguration: DisclosureConfigurationEnum.REDACTED,
            forcedDisclosureConfiguration: false,
            disclosedFields: [],
            visibleViaRdds: true,
          },
        },
        contactAdministrator: {
          id: 'admin-id',
          disclosurePolicy: {
            disclosureConfiguration: DisclosureConfigurationEnum.REDACTED,
            forcedDisclosureConfiguration: false,
            disclosedFields: [],
            visibleViaRdds: true,
          },
        },
        contactTechnical: { id: 'tech-id' },
        contactBilling: { id: 'billing-id' },
      });

      const status = dataProtectionStatus(domainResource);
      expect(status).toBe(DataProtectionStatus.ACTIVE);
    });

    it('should return PARTIAL when some visible contacts are redacted', () => {
      const domainResource = createMockDomainResource({
        contactOwner: {
          id: 'owner-id',
          disclosurePolicy: {
            disclosureConfiguration: DisclosureConfigurationEnum.REDACTED,
            forcedDisclosureConfiguration: false,
            disclosedFields: [],
            visibleViaRdds: true,
          },
        },
        contactAdministrator: {
          id: 'admin-id',
          disclosurePolicy: {
            disclosureConfiguration: DisclosureConfigurationEnum.DISCLOSED,
            forcedDisclosureConfiguration: false,
            disclosedFields: ['EMAIL', 'PHONE'],
            visibleViaRdds: true,
          },
        },
        contactTechnical: { id: 'tech-id' },
        contactBilling: { id: 'billing-id' },
      });

      const status = dataProtectionStatus(domainResource);
      expect(status).toBe(DataProtectionStatus.PARTIAL);
    });
  });

  describe('translateContactType', () => {
    it('should return empty object when no contacts configuration', () => {
      const domainResource = createMockDomainResource({
        contactOwner: { id: 'owner-id' },
        contactAdministrator: { id: 'admin-id' },
        contactTechnical: { id: 'tech-id' },
        contactBilling: { id: 'billing-id' },
      });

      domainResource.currentState.contactsConfiguration = undefined as any;

      const result = translateContactType(domainResource);
      expect(result).toEqual({});
    });

    it('should return translation keys for all contact types', () => {
      const domainResource = createMockDomainResource({
        contactOwner: { id: 'owner-id' },
        contactAdministrator: { id: 'admin-id' },
        contactTechnical: { id: 'tech-id' },
        contactBilling: { id: 'billing-id' },
      });

      const result = translateContactType(domainResource);

      expect(result).toHaveProperty('contactOwner');
      expect(result).toHaveProperty('contactAdministrator');
      expect(result).toHaveProperty('contactTechnical');
      expect(result).toHaveProperty('contactBilling');
      expect(Object.keys(result)).toHaveLength(4);
    });

    it('should only return keys for existing contacts', () => {
      const domainResource = createMockDomainResource({
        contactOwner: { id: 'owner-id' },
        contactAdministrator: { id: 'admin-id' },
        contactTechnical: { id: 'tech-id' },
        contactBilling: { id: 'billing-id' },
      });

      const {
        contactOwner,
        contactAdministrator,
      } = domainResource.currentState.contactsConfiguration;
      domainResource.currentState.contactsConfiguration = {
        contactOwner,
        contactAdministrator,
      } as any;

      const result = translateContactType(domainResource);

      expect(result).toHaveProperty('contactOwner');
      expect(result).toHaveProperty('contactAdministrator');
      expect(result).not.toHaveProperty('contactTechnical');
      expect(result).not.toHaveProperty('contactBilling');
      expect(Object.keys(result)).toHaveLength(2);
    });
  });

  describe('translateContactField', () => {
    it('should have translation key for ADDRESS field', () => {
      expect(translateContactField[DataProtectionFieldEnum.ADDRESS]).toBe(
        'domain_tab_general_information_data_drawer_contact_field_address',
      );
    });

    it('should have translation key for CITY field', () => {
      expect(translateContactField[DataProtectionFieldEnum.CITY]).toBe(
        'domain_tab_general_information_data_drawer_contact_field_city',
      );
    });

    it('should have translation key for COUNTRY field', () => {
      expect(translateContactField[DataProtectionFieldEnum.COUNTRY]).toBe(
        'domain_tab_general_information_data_drawer_contact_field_country',
      );
    });

    it('should have translation key for EMAIL field', () => {
      expect(translateContactField[DataProtectionFieldEnum.EMAIL]).toBe(
        'domain_tab_general_information_data_drawer_contact_field_email',
      );
    });

    it('should have translation key for FAX field', () => {
      expect(translateContactField[DataProtectionFieldEnum.FAX]).toBe(
        'domain_tab_general_information_data_drawer_contact_field_fax',
      );
    });

    it('should have translation key for NAME field', () => {
      expect(translateContactField[DataProtectionFieldEnum.NAME]).toBe(
        'domain_tab_general_information_data_drawer_contact_field_name',
      );
    });

    it('should have translation key for ORGANISATION field', () => {
      expect(translateContactField[DataProtectionFieldEnum.ORGANISATION]).toBe(
        'domain_tab_general_information_data_drawer_contact_field_organization',
      );
    });

    it('should have translation key for PHONE field', () => {
      expect(translateContactField[DataProtectionFieldEnum.PHONE]).toBe(
        'domain_tab_general_information_data_drawer_contact_field_phone',
      );
    });

    it('should have translation key for PROVINCE field', () => {
      expect(translateContactField[DataProtectionFieldEnum.PROVINCE]).toBe(
        'domain_tab_general_information_data_drawer_contact_field_province',
      );
    });

    it('should have translation key for ZIP field', () => {
      expect(translateContactField[DataProtectionFieldEnum.ZIP]).toBe(
        'domain_tab_general_information_data_drawer_contact_field_zip',
      );
    });

    it('should have all DataProtectionFieldEnum values', () => {
      const enumValues = Object.values(DataProtectionFieldEnum);
      const translationKeys = Object.keys(translateContactField);

      expect(translationKeys).toHaveLength(enumValues.length);
      enumValues.forEach((value) => {
        expect(translateContactField).toHaveProperty(value);
      });
    });
  });
});
