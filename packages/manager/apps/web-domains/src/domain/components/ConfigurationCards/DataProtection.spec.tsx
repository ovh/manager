import '@/common/setupTests';
import { render, screen } from '@/common/utils/test.provider';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { wrapper } from '@/common/utils/test.provider';
import DataProtection from './DataProtection';
import {
  TDomainResource,
  DisclosureConfigurationEnum,
} from '@/domain/types/domainResource';
import { DnsConfigurationTypeEnum } from '@/domain/enum/dnsConfigurationType.enum';
import { DomainStateEnum } from '@/domain/enum/domainState.enum';
import { ProtectionStateEnum } from '@/domain/enum/protectionState.enum';
import { SuspensionStateEnum } from '@/domain/enum/suspensionState.enum';
import { ResourceStatusEnum } from '@/domain/enum/resourceStatus.enum';
import { supportedAlgorithms } from '@/domain/constants/dsRecords';

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

describe('DataProtection component', () => {
  const mockSetDataProtectionDrawerOpened = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when data protection is ACTIVE', () => {
    it('should display active status badge', () => {
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

      render(
        <DataProtection
          domainResource={domainResource}
          setDataProtectionDrawerOpened={mockSetDataProtectionDrawerOpened}
        />,
        {
          wrapper,
        },
      );

      expect(
        screen.getByText('domain_tab_general_information_data_protection'),
      ).toBeInTheDocument();
    });

    it('should enable manage button when protection is active', async () => {
      const user = userEvent.setup();
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
        contactAdministrator: { id: 'admin-id' },
        contactTechnical: { id: 'tech-id' },
        contactBilling: { id: 'billing-id' },
      });

      render(
        <DataProtection
          domainResource={domainResource}
          setDataProtectionDrawerOpened={mockSetDataProtectionDrawerOpened}
        />,
        {
          wrapper,
        },
      );

      const manageButton = screen.getByTestId('action-item-1');
      expect(manageButton).not.toBeDisabled();

      await user.click(manageButton);

      expect(mockSetDataProtectionDrawerOpened).toHaveBeenCalledWith(true);
    });
  });

  describe('when data protection is PARTIAL', () => {
    it('should display partial status badge', () => {
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

      render(
        <DataProtection
          domainResource={domainResource}
          setDataProtectionDrawerOpened={mockSetDataProtectionDrawerOpened}
        />,
        {
          wrapper,
        },
      );

      expect(
        screen.getByText('domain_tab_general_information_data_protection'),
      ).toBeInTheDocument();
    });
  });

  describe('when data protection is NONE', () => {
    it('should display none status when no contacts are redacted', () => {
      const domainResource = createMockDomainResource({
        contactOwner: {
          id: 'owner-id',
          disclosurePolicy: {
            disclosureConfiguration: DisclosureConfigurationEnum.DISCLOSED,
            forcedDisclosureConfiguration: false,
            disclosedFields: ['EMAIL', 'NAME'],
            visibleViaRdds: true,
          },
        },
        contactAdministrator: { id: 'admin-id' },
        contactTechnical: { id: 'tech-id' },
        contactBilling: { id: 'billing-id' },
      });

      render(
        <DataProtection
          domainResource={domainResource}
          setDataProtectionDrawerOpened={mockSetDataProtectionDrawerOpened}
        />,
        {
          wrapper,
        },
      );

      expect(
        screen.getByText('domain_tab_general_information_data_protection'),
      ).toBeInTheDocument();
    });
  });

  describe('when data protection is DISABLED', () => {
    it('should display disabled status when forceDisclosure is true', () => {
      const domainResource = createMockDomainResource({
        contactOwner: {
          id: 'owner-id',
          disclosurePolicy: {
            disclosureConfiguration: DisclosureConfigurationEnum.DISCLOSED,
            forcedDisclosureConfiguration: true,
            disclosedFields: ['EMAIL', 'NAME'],
            visibleViaRdds: true,
          },
        },
        contactAdministrator: { id: 'admin-id' },
        contactTechnical: { id: 'tech-id' },
        contactBilling: { id: 'billing-id' },
      });

      render(
        <DataProtection
          domainResource={domainResource}
          setDataProtectionDrawerOpened={mockSetDataProtectionDrawerOpened}
        />,
        {
          wrapper,
        },
      );

      expect(
        screen.getByText('domain_tab_general_information_data_protection'),
      ).toBeInTheDocument();
    });

    it('should disable manage button when protection is disabled', async () => {
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
        contactAdministrator: { id: 'admin-id' },
        contactTechnical: { id: 'tech-id' },
        contactBilling: { id: 'billing-id' },
      });

      render(
        <DataProtection
          domainResource={domainResource}
          setDataProtectionDrawerOpened={mockSetDataProtectionDrawerOpened}
        />,
        {
          wrapper,
        },
      );

      const manageButton = screen.getByTestId('action-item-1');
      expect(manageButton).toBeDisabled();
    });
  });
});
