import '@/common/setupTests';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { useAuthorizationIam } from '@ovh-ux/manager-react-components';
import { wrapper } from '@/common/utils/test.provider';
import DnssecToggleStatus from './DnssecToggleStatus';
import { DnssecStatusEnum } from '@/domain/enum/dnssecStatus.enum';
import { TDomainResource } from '@/domain/types/domainResource';
import { DnsConfigurationTypeEnum } from '@/domain/enum/dnsConfigurationType.enum';
import { DomainStateEnum } from '@/domain/enum/domainState.enum';
import { ProtectionStateEnum } from '@/domain/enum/protectionState.enum';
import { SuspensionStateEnum } from '@/domain/enum/suspensionState.enum';
import { ResourceStatusEnum } from '@/domain/enum/resourceStatus.enum';

describe('DnssecToggleStatus component', () => {
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
      extension: '.com',
      mainState: DomainStateEnum.OK,
      name: 'example.com',
      protectionState: ProtectionStateEnum.UNPROTECTED,
      suspensionState: SuspensionStateEnum.NOT_SUSPENDED,
    },
    currentTasks: [],
    iam: null,
    id: 'domain-id',
    resourceStatus: ResourceStatusEnum.READY,
  };

  it('renders loading state', () => {
    (useAuthorizationIam as jest.Mock).mockReturnValue({
      isAuthorized: true,
    });
    render(
      <DnssecToggleStatus
        dnssecStatus={{ status: DnssecStatusEnum.DISABLED }}
        isDnssecStatusLoading={true}
        domainResource={mockDomainResource}
        dnssecModalOpened={false}
        setDnssecModalOpened={vi.fn()}
      />,
      { wrapper },
    );
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('renders unauthorized state', () => {
    (useAuthorizationIam as jest.Mock).mockReturnValue({
      isPending: false,
      isAuthorized: false,
    });
    render(
      <DnssecToggleStatus
        dnssecStatus={{ status: DnssecStatusEnum.DISABLED }}
        isDnssecStatusLoading={false}
        domainResource={mockDomainResource}
        dnssecModalOpened={false}
        setDnssecModalOpened={vi.fn()}
      />,
      { wrapper },
    );
    expect(
      screen.getAllByText(/domain_tab_general_information_dnssec/i),
    ).toHaveLength(2);
  });

  it('renders authorized state with DNSSEC enabled', () => {
    (useAuthorizationIam as jest.Mock).mockReturnValue({
      isPending: false,
      isAuthorized: true,
    });
    render(
      <DnssecToggleStatus
        dnssecStatus={{ status: DnssecStatusEnum.ENABLED }}
        isDnssecStatusLoading={false}
        domainResource={mockDomainResource}
        dnssecModalOpened={false}
        setDnssecModalOpened={vi.fn()}
      />,
      { wrapper },
    );
    expect(
      screen.getAllByText(/domain_tab_general_information_dnssec/i),
    ).toHaveLength(2);
    expect(screen.getByTestId('toggle')).toBeInTheDocument();
  });

  it('renders authorized state with DNSSEC disabled', () => {
    (useAuthorizationIam as jest.Mock).mockReturnValue({
      isPending: false,
      isAuthorized: true,
    });
    render(
      <DnssecToggleStatus
        dnssecStatus={{ status: DnssecStatusEnum.DISABLED }}
        isDnssecStatusLoading={false}
        domainResource={mockDomainResource}
        dnssecModalOpened={false}
        setDnssecModalOpened={vi.fn()}
      />,
      { wrapper },
    );
    expect(
      screen.getAllByText(/domain_tab_general_information_dnssec/i),
    ).toHaveLength(2);
    expect(screen.getByTestId('toggle')).toBeInTheDocument();
  });

  it('renders authorized state with DNSSEC not supported', () => {
    (useAuthorizationIam as jest.Mock).mockReturnValue({
      isPending: false,
      isAuthorized: true,
    });
    render(
      <DnssecToggleStatus
        dnssecStatus={{ status: DnssecStatusEnum.DISABLED }}
        isDnssecStatusLoading={false}
        domainResource={{
          ...mockDomainResource,
          currentState: {
            ...mockDomainResource.currentState,
            dnsConfiguration: {
              ...mockDomainResource.currentState.dnsConfiguration,
              dnssecSupported: false,
            },
          },
        }}
        dnssecModalOpened={false}
        setDnssecModalOpened={vi.fn()}
      />,
      { wrapper },
    );
    expect(
      screen.getAllByText(/domain_tab_general_information_dnssec/i),
    ).toHaveLength(2);
    expect(screen.getByTestId('toggle')).toBeInTheDocument();
  });
});
