import '@/common/setupTests';
import { render, screen, wrapper } from '@/common/utils/test.provider';
import { vi } from 'vitest';
import DnsState from './DnsState';
import { OptionStateEnum } from '@/domain/enum/optionState.enum';
import { TDomainResource } from '@/domain/types/domainResource';
import { DnsConfigurationTypeEnum } from '@/domain/enum/dnsConfigurationType.enum';
import { DomainStateEnum } from '@/domain/enum/domainState.enum';
import { ProtectionStateEnum } from '@/domain/enum/protectionState.enum';
import { SuspensionStateEnum } from '@/domain/enum/suspensionState.enum';
import { ResourceStatusEnum } from '@/domain/enum/resourceStatus.enum';
import { OptionEnum } from '@/common/enum/option.enum';
import { supportedAlgorithms } from '@/domain/constants/dsRecords';

describe('DnsState component', () => {
  const mockDomainResource: TDomainResource = {
    checksum: 'checksum-value',
    currentState: {
      additionalStates: [],
      dnsConfiguration: {
        configurationType: DnsConfigurationTypeEnum.HOSTING,
        glueRecordIPv6Supported: true,
        hostSupported: true,
        maxDNS: 10,
        minDNS: 2,
        nameServers: [
          {
            ipv4: '192.0.2.1',
            ipv6: '2001:db8::1',
            nameServer: 'ns1.example.com',
            nameServerType: DnsConfigurationTypeEnum.HOSTING,
          },
          {
            ipv4: '192.0.2.2',
            ipv6: '2001:db8::2',
            nameServer: 'ns2.example.com',
            nameServerType: DnsConfigurationTypeEnum.HOSTING,
          },
        ],
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
      contactsConfiguration: {
        contactAdministrator: {
          id: 'contact-admin-id',
        },
        contactBilling: {
          id: 'contact-billing-id',
        },
        contactTechnical: {
          id: 'contact-tech-id',
        },
        contactOwner: {
          id: 'contact-owner-id',
        },
      },
      extension: '.com',
      mainState: DomainStateEnum.OK,
      name: 'example.com',
      protectionState: ProtectionStateEnum.UNPROTECTED,
      suspensionState: SuspensionStateEnum.NOT_SUSPENDED,
      authInfoManagedByOVHcloud: true,
      authInfoSupported: true,
      createdAt: '2024-01-01T00:00:00Z',
    },
    currentTasks: [],
    iam: null,
    id: 'domain-id',
    resourceStatus: ResourceStatusEnum.READY,
  };

  const mockAnycastOption = {
    state: OptionStateEnum.SUBSCRIBED,
    expirationDate: new Date('2025-12-31T23:59:59Z').toString(),
  };

  it('renders DNS state label and notes', () => {
    render(
      <DnsState
        serviceName="example-service"
        domainResource={mockDomainResource}
        anycastOption={{
          ...mockAnycastOption,
          option: OptionEnum.DNS_ANYCAST,
        }}
        isFetchingAnycastOption={false}
        anycastTerminateModalOpen={false}
        setAnycastTerminateModalOpen={vi.fn()}
        restoreAnycast={false}
        setRestoreAnycast={vi.fn()}
      />,
      { wrapper },
    );

    expect(
      screen.getByText('domain_tab_general_information_dns_standard'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('domain_dns_table_renew_anycast'),
    ).toBeInTheDocument();
  });

  it('renders tooltip with anycast label when anycast is subscribed', () => {
    const { container } = render(
      <DnsState
        domainResource={mockDomainResource}
        serviceName="example-service"
        anycastOption={{
          ...mockAnycastOption,
          option: OptionEnum.DNS_ANYCAST,
        }}
        isFetchingAnycastOption={false}
        anycastTerminateModalOpen={false}
        setAnycastTerminateModalOpen={vi.fn()}
        restoreAnycast={false}
        setRestoreAnycast={vi.fn()}
      />,
      { wrapper },
    );

    const button = container.querySelector(
      'ods-button[label*="domain_dns_tab_button_cancel_terminate_anycast"]',
    );
    expect(button).toBeInTheDocument();
  });

  it('renders tooltip with anycast label when anycast is released', () => {
    const releasedAnycastOption = {
      ...mockAnycastOption,
      state: OptionStateEnum.RELEASED,
    };

    const { container } = render(
      <DnsState
        serviceName="example-service"
        domainResource={mockDomainResource}
        anycastOption={{
          ...releasedAnycastOption,
          option: OptionEnum.DNS_ANYCAST,
        }}
        isFetchingAnycastOption={false}
        anycastTerminateModalOpen={false}
        setAnycastTerminateModalOpen={vi.fn()}
        restoreAnycast={false}
        setRestoreAnycast={vi.fn()}
      />,
      { wrapper },
    );

    const button = container.querySelector(
      'ods-button[label*="domain_dns_tab_button_cancel_terminate_anycast"]',
    );
    expect(button).toBeInTheDocument();
  });

  it('renders tooltip with anycast label when anycast is not set', () => {
    const { container } = render(
      <DnsState
        domainResource={mockDomainResource}
        serviceName="example-service"
        anycastOption={null}
        isFetchingAnycastOption={false}
        anycastTerminateModalOpen={false}
        setAnycastTerminateModalOpen={vi.fn()}
        restoreAnycast={false}
        setRestoreAnycast={vi.fn()}
      />,
      { wrapper },
    );

    const button = container.querySelector(
      'ods-button[label="domain_tab_DNS_anycast_order"]',
    );
    expect(button).toBeInTheDocument();
  });
});
