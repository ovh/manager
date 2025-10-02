import '@/common/setupTests';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { wrapper } from '@/common/utils/test.provider';
import DnsState from './DnsState';
import { OptionStateEnum } from '@/domain/enum/optionState.enum';
import { TDomainResource } from '@/domain/types/domainResource';
import { DnsConfigurationTypeEnum } from '@/domain/enum/dnsConfigurationType.enum';
import { DomainStateEnum } from '@/domain/enum/domainState.enum';
import { ProtectionStateEnum } from '@/domain/enum/protectionState.enum';
import { SuspensionStateEnum } from '@/domain/enum/suspensionState.enum';
import { ResourceStatusEnum } from '@/domain/enum/resourceStatus.enum';
import { OptionEnum } from '@/common/enum/option.enum';

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
      screen.getByText('domain_tab_general_information_note_anycast'),
    ).toBeInTheDocument();
  });

  it('renders tooltip with anycast label when anycast is subscribed', () => {
    render(
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

    expect(
      screen.getByText('domain_dns_tab_button_cancel_terminate_anycast'),
    ).toBeInTheDocument();
  });

  it('renders tooltip with anycast label when anycast is released', () => {
    const releasedAnycastOption = {
      ...mockAnycastOption,
      state: OptionStateEnum.RELEASED,
    };

    render(
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

    expect(
      screen.getByText('domain_dns_tab_button_cancel_terminate_anycast'),
    ).toBeInTheDocument();
  });

  it('renders tooltip with anycast label when anycast is not set', () => {
    render(
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

    expect(
      screen.getByText('domain_dns_tab_button_order_anycast'),
    ).toBeInTheDocument();
  });
});
