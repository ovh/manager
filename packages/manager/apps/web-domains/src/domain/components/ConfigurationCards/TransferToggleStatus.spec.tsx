import '@/common/setupTests';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  wrapper,
} from '@/common/utils/test.provider';
import userEvent from '@testing-library/user-event';
import { Mock, vi } from 'vitest';
import TransferToggleStatus from './TransferToggleStatus';
import { TDomainResource } from '@/domain/types/domainResource';
import { DnsConfigurationTypeEnum } from '@/domain/enum/dnsConfigurationType.enum';
import { DomainStateEnum } from '@/domain/enum/domainState.enum';
import { ProtectionStateEnum } from '@/domain/enum/protectionState.enum';
import { SuspensionStateEnum } from '@/domain/enum/suspensionState.enum';
import { ResourceStatusEnum } from '@/domain/enum/resourceStatus.enum';
import { StatusEnum } from '@/domain/enum/Status.enum';
import { supportedAlgorithms } from '@/domain/constants/dsRecords';
import { useAuthorizationIam } from '@ovh-ux/manager-react-components';
import { useGetIAMResource } from '@/common/hooks/iam/useGetIAMResource';

vi.mock('@/common/hooks/iam/useGetIAMResource', () => ({
  useGetIAMResource: vi.fn(),
}));

describe('TransferToggleStatus component', () => {
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
        hosts: [
          {
            host: 'ns1.example.com',
            ips: ['1.0.0.0'],
            status: StatusEnum.ENABLED,
          },
        ],
      },
      dnssecConfiguration: {
        dnssecSupported: true,
        dsData: [
          {
            algorithm: 8,
            keyTag: 0,
            flags: 0,
            publicKey:
              'MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgGlVDb17VQPrH7bOLBGc6N+/D84tbly3RQ/kQLPq73H6nhCI+vg1euNvnZaFBDiHktGRDlmayzoo5k/j/65V5TkoFE/x5yaiPGHXKIb+QsZCbHeNkEx/di4meHY7sETyla97uBM5BJUBc7ZhCoR2+Jc+HHdBLrQ5/9LpR0nEsfn7AgMBAAE=',
          },
        ],
        supportedAlgorithms,
      },
      extension: '.com',
      mainState: DomainStateEnum.OK,
      name: 'example.com',
      protectionState: ProtectionStateEnum.PROTECTED,
      suspensionState: SuspensionStateEnum.NOT_SUSPENDED,
      authInfoManagedByOVHcloud: true,
      authInfoSupported: true,
      contactsConfiguration: {
        contactOwner: { id: 'owner-id' },
        contactAdministrator: { id: 'admin-id' },
        contactTechnical: { id: 'tech-id' },
        contactBilling: { id: 'billing-id' },
      },
      createdAt: '2024-01-01T00:00:00Z',
    },
    currentTasks: [],
    iam: null,
    id: 'domain-id',
    resourceStatus: ResourceStatusEnum.READY,
    targetSpec: {
      protectionState: ProtectionStateEnum.PROTECTED,
    },
  };

  const mockSetTransferModalOpened = vi.fn();
  const mockSetTransferAuthInfoModalOpened = vi.fn();
  const mockSetTagModalOpened = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useGetIAMResource as Mock).mockReturnValue({
      data: [{ urn: 'urn:domain:123' }],
    });
    (useAuthorizationIam as Mock).mockReturnValue({
      isPending: false,
      isAuthorized: true,
    });
  });

  it('renders with PROTECTED state', async () => {
    render(
      <TransferToggleStatus
        domainResource={mockDomainResource}
        transferModalOpened={false}
        setTransferModalOpened={mockSetTransferModalOpened}
        setTransferAuthInfoModalOpened={mockSetTransferAuthInfoModalOpened}
        setTagModalOpened={mockSetTagModalOpened}
      />,
      { wrapper },
    );

    await waitFor(() => {
      expect(
        screen.getByText('domain_tab_general_information_transfer'),
      ).toBeInTheDocument();
    });
    expect(screen.getByTestId('toggle')).toBeInTheDocument();
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
    expect(
      screen.queryByText('domain_tab_general_information_transfer_authinfo'),
    ).not.toBeInTheDocument();
  });

  it('renders with UNPROTECTED state and shows authinfo link', async () => {
    const unprotectedDomainResource = {
      ...mockDomainResource,
      currentState: {
        ...mockDomainResource.currentState,
        protectionState: ProtectionStateEnum.UNPROTECTED,
      },
      targetSpec: {
        protectionState: ProtectionStateEnum.UNPROTECTED,
      },
    };

    render(
      <TransferToggleStatus
        domainResource={unprotectedDomainResource}
        transferModalOpened={false}
        setTransferModalOpened={mockSetTransferModalOpened}
        setTransferAuthInfoModalOpened={mockSetTransferAuthInfoModalOpened}
        setTagModalOpened={mockSetTagModalOpened}
      />,
      { wrapper },
    );

    await waitFor(() => {
      expect(
        screen.getByText('domain_tab_general_information_transfer'),
      ).toBeInTheDocument();
    });
    expect(screen.getByTestId('toggle')).toBeInTheDocument();
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    expect(
      screen.getByText('domain_tab_general_information_transfer_authinfo'),
    ).toBeInTheDocument();
  });

  it('calls setTransferModalOpened when toggle is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TransferToggleStatus
        domainResource={mockDomainResource}
        transferModalOpened={false}
        setTransferModalOpened={mockSetTransferModalOpened}
        setTransferAuthInfoModalOpened={mockSetTransferAuthInfoModalOpened}
        setTagModalOpened={mockSetTagModalOpened}
      />,
      { wrapper },
    );

    const toggle = screen.getByTestId('toggle');
    await act(() => user.click(toggle));

    expect(mockSetTransferModalOpened).toHaveBeenCalledWith(true);
    expect(mockSetTransferModalOpened).toHaveBeenCalledTimes(1);
  });

  it('calls setTransferModalOpened with opposite value when modal is already opened', async () => {
    const user = userEvent.setup();
    render(
      <TransferToggleStatus
        domainResource={mockDomainResource}
        transferModalOpened={true}
        setTransferModalOpened={mockSetTransferModalOpened}
        setTransferAuthInfoModalOpened={mockSetTransferAuthInfoModalOpened}
        setTagModalOpened={mockSetTagModalOpened}
      />,
      { wrapper },
    );

    const toggle = screen.getByTestId('toggle');
    await act(() => user.click(toggle));

    expect(mockSetTransferModalOpened).toHaveBeenCalledWith(false);
    expect(mockSetTransferModalOpened).toHaveBeenCalledTimes(1);
  });

  it('calls setTransferAuthInfoModalOpened when authinfo link is clicked', async () => {
    const unprotectedDomainResource = {
      ...mockDomainResource,
      currentState: {
        ...mockDomainResource.currentState,
        protectionState: ProtectionStateEnum.UNPROTECTED,
      },
      targetSpec: {
        protectionState: ProtectionStateEnum.UNPROTECTED,
      },
    };

    render(
      <TransferToggleStatus
        domainResource={unprotectedDomainResource}
        transferModalOpened={false}
        setTransferModalOpened={mockSetTransferModalOpened}
        setTransferAuthInfoModalOpened={mockSetTransferAuthInfoModalOpened}
        setTagModalOpened={mockSetTagModalOpened}
      />,
      { wrapper },
    );

    await waitFor(() => {
      const authinfoLink = screen.getByText(
        'domain_tab_general_information_transfer_authinfo',
      );
      fireEvent.click(authinfoLink);
    });

    expect(mockSetTransferAuthInfoModalOpened).toHaveBeenCalledWith(true);
    expect(mockSetTransferAuthInfoModalOpened).toHaveBeenCalledTimes(1);
  });

  it('renders tooltip with correct content', async () => {
    render(
      <TransferToggleStatus
        domainResource={mockDomainResource}
        transferModalOpened={false}
        setTransferModalOpened={mockSetTransferModalOpened}
        setTransferAuthInfoModalOpened={mockSetTransferAuthInfoModalOpened}
        setTagModalOpened={mockSetTagModalOpened}
      />,
      { wrapper },
    );

    await waitFor(() => {
      const tooltipIcon = screen.getByTestId(
        'question-circle-icon-domain_tab_general_information_transfer_activated',
      );
      expect(tooltipIcon).toBeInTheDocument();
    });
  });

  it('renders toggle control', async () => {
    render(
      <TransferToggleStatus
        domainResource={mockDomainResource}
        transferModalOpened={false}
        setTransferModalOpened={mockSetTransferModalOpened}
        setTransferAuthInfoModalOpened={mockSetTransferAuthInfoModalOpened}
        setTagModalOpened={mockSetTagModalOpened}
      />,
      { wrapper },
    );

    await waitFor(() => {
      expect(screen.getByTestId('toggle-control')).toBeInTheDocument();
    });
  });

  it('renders badge with correct status', async () => {
    render(
      <TransferToggleStatus
        domainResource={mockDomainResource}
        transferModalOpened={false}
        setTransferModalOpened={mockSetTransferModalOpened}
        setTransferAuthInfoModalOpened={mockSetTransferAuthInfoModalOpened}
        setTagModalOpened={mockSetTagModalOpened}
      />,
      { wrapper },
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          '@ovh-ux/manager-common-translations/service:service_state_enabled',
        ),
      ).toBeInTheDocument();
    });
  });

  it('renders with disabled toggle and badge showing activation when UNPROTECTED with targetSpec PROTECTED', async () => {
    const unprotectedDomainResource = {
      ...mockDomainResource,
      currentState: {
        ...mockDomainResource.currentState,
        protectionState: ProtectionStateEnum.UNPROTECTED,
      },
      targetSpec: {
        protectionState: ProtectionStateEnum.PROTECTED,
      },
    };

    render(
      <TransferToggleStatus
        domainResource={unprotectedDomainResource}
        transferModalOpened={false}
        setTransferModalOpened={mockSetTransferModalOpened}
        setTransferAuthInfoModalOpened={mockSetTransferAuthInfoModalOpened}
        setTagModalOpened={mockSetTagModalOpened}
      />,
      { wrapper },
    );

    await waitFor(() => {
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
    });
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    expect(
      screen.getByText('domain_dns_table_state_activating'),
    ).toBeInTheDocument();
  });

  it('renders enabled toggle when PROTECTED', async () => {
    render(
      <TransferToggleStatus
        domainResource={mockDomainResource}
        transferModalOpened={false}
        setTransferModalOpened={mockSetTransferModalOpened}
        setTransferAuthInfoModalOpened={mockSetTransferAuthInfoModalOpened}
        setTagModalOpened={mockSetTagModalOpened}
      />,
      { wrapper },
    );

    await waitFor(() => {
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeDisabled();
    });
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
    expect(
      screen.getByText(
        '@ovh-ux/manager-common-translations/service:service_state_enabled',
      ),
    ).toBeInTheDocument();
  });

  it('renders correct tooltip content for PROTECTED state', async () => {
    render(
      <TransferToggleStatus
        domainResource={mockDomainResource}
        transferModalOpened={false}
        setTransferModalOpened={mockSetTransferModalOpened}
        setTransferAuthInfoModalOpened={mockSetTransferAuthInfoModalOpened}
        setTagModalOpened={mockSetTagModalOpened}
      />,
      { wrapper },
    );

    await waitFor(() => {
      expect(
        screen.getByText('domain_tab_general_information_transfer_activated'),
      ).toBeInTheDocument();
    });
  });

  it('renders correct tooltip content for UNPROTECTED state with activation in progress', async () => {
    const unprotectedDomainResource = {
      ...mockDomainResource,
      currentState: {
        ...mockDomainResource.currentState,
        protectionState: ProtectionStateEnum.UNPROTECTED,
      },
      targetSpec: {
        protectionState: ProtectionStateEnum.PROTECTED,
      },
    };

    render(
      <TransferToggleStatus
        domainResource={unprotectedDomainResource}
        transferModalOpened={false}
        setTransferModalOpened={mockSetTransferModalOpened}
        setTransferAuthInfoModalOpened={mockSetTransferAuthInfoModalOpened}
        setTagModalOpened={mockSetTagModalOpened}
      />,
      { wrapper },
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          'domain_tab_general_information_transfer_activation_progress',
        ),
      ).toBeInTheDocument();
    });
  });

  it('shows tag link when authInfo is not supported', async () => {
    const noAuthInfoDomainResource = {
      ...mockDomainResource,
      currentState: {
        ...mockDomainResource.currentState,
        authInfoSupported: false,
      },
      targetSpec: {
        protectionState: ProtectionStateEnum.PROTECTED,
      },
    };

    render(
      <TransferToggleStatus
        domainResource={noAuthInfoDomainResource}
        transferModalOpened={false}
        setTransferModalOpened={mockSetTransferModalOpened}
        setTransferAuthInfoModalOpened={mockSetTransferAuthInfoModalOpened}
        setTagModalOpened={mockSetTagModalOpened}
      />,
      { wrapper },
    );

    await waitFor(() => {
      expect(
        screen.getByText('domain_tab_general_information_transfer_tag'),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByText(
        'domain_tab_general_information_transfer_authinfo_not_supported',
      ),
    ).toBeInTheDocument();
  });

  it('calls setTagModalOpened when tag link is clicked', async () => {
    const noAuthInfoDomainResource = {
      ...mockDomainResource,
      currentState: {
        ...mockDomainResource.currentState,
        authInfoSupported: false,
      },
      targetSpec: {
        protectionState: ProtectionStateEnum.PROTECTED,
      },
    };

    render(
      <TransferToggleStatus
        domainResource={noAuthInfoDomainResource}
        transferModalOpened={false}
        setTransferModalOpened={mockSetTransferModalOpened}
        setTransferAuthInfoModalOpened={mockSetTransferAuthInfoModalOpened}
        setTagModalOpened={mockSetTagModalOpened}
      />,
      { wrapper },
    );

    await waitFor(() => {
      const tagLink = screen.getByText(
        'domain_tab_general_information_transfer_tag',
      );
      fireEvent.click(tagLink);
    });

    expect(mockSetTagModalOpened).toHaveBeenCalledWith(true);
    expect(mockSetTagModalOpened).toHaveBeenCalledTimes(1);
  });

  it('renders enabled toggle when UNPROTECTED without targetSpec', async () => {
    const unprotectedDomainResource = {
      ...mockDomainResource,
      currentState: {
        ...mockDomainResource.currentState,
        protectionState: ProtectionStateEnum.UNPROTECTED,
      },
      targetSpec: {
        protectionState: ProtectionStateEnum.UNPROTECTED,
      },
    };

    render(
      <TransferToggleStatus
        domainResource={unprotectedDomainResource}
        transferModalOpened={false}
        setTransferModalOpened={mockSetTransferModalOpened}
        setTransferAuthInfoModalOpened={mockSetTransferAuthInfoModalOpened}
        setTagModalOpened={mockSetTagModalOpened}
      />,
      { wrapper },
    );

    await waitFor(() => {
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeDisabled();
    });
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('renders with disabled toggle when PROTECTED with targetSpec UNPROTECTED', async () => {
    const deactivatingDomainResource = {
      ...mockDomainResource,
      currentState: {
        ...mockDomainResource.currentState,
        protectionState: ProtectionStateEnum.PROTECTED,
      },
      targetSpec: {
        protectionState: ProtectionStateEnum.UNPROTECTED,
      },
    };

    render(
      <TransferToggleStatus
        domainResource={deactivatingDomainResource}
        transferModalOpened={false}
        setTransferModalOpened={mockSetTransferModalOpened}
        setTransferAuthInfoModalOpened={mockSetTransferAuthInfoModalOpened}
        setTagModalOpened={mockSetTagModalOpened}
      />,
      { wrapper },
    );

    await waitFor(() => {
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
    });
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
    expect(
      screen.getByText('domain_dns_table_state_deleting'),
    ).toBeInTheDocument();
  });

  it('renders with disabled toggle when the user is not authorized', async () => {
    (useAuthorizationIam as Mock).mockReturnValue({
      isPending: false,
      isAuthorized: false,
    });

    render(
      <TransferToggleStatus
        domainResource={mockDomainResource}
        transferModalOpened={false}
        setTransferModalOpened={mockSetTransferModalOpened}
        setTransferAuthInfoModalOpened={mockSetTransferAuthInfoModalOpened}
        setTagModalOpened={mockSetTagModalOpened}
      />,
      { wrapper },
    );

    await waitFor(() => {
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
    });
  });
});
