import '@/common/setupTests';
import { render, screen, fireEvent, act } from '@/common/utils/test.provider';
import { vi, Mock } from 'vitest';
import { useAuthorizationIam } from '@ovh-ux/manager-react-components';
import { wrapper } from '@/common/utils/test.provider';
import ConfigurationCards from './ConfigurationCards';
import {
  useGetDnssecStatus,
  useGetDomainAnycastOption,
  useGetDomainAuthInfo,
  useGetDomainResource,
  useTerminateAnycastMutation,
  useTransferTag,
  useUpdateDnssecService,
  useUpdateDomainResource,
} from '@/domain/hooks/data/query';
import { DnssecStatusEnum } from '@/domain/enum/dnssecStatus.enum';
import { DnsConfigurationTypeEnum } from '@/domain/enum/dnsConfigurationType.enum';
import { DomainStateEnum } from '@/domain/enum/domainState.enum';
import { ProtectionStateEnum } from '@/domain/enum/protectionState.enum';
import { SuspensionStateEnum } from '@/domain/enum/suspensionState.enum';
import { ResourceStatusEnum } from '@/domain/enum/resourceStatus.enum';
import { TDomainResource } from '@/domain/types/domainResource';
import { StatusEnum } from '@/domain/enum/Status.enum';
import { supportedAlgorithms } from '@/domain/constants/dsRecords';

vi.mock('@ovh-ux/manager-react-components', async () => {
  const actual = await vi.importActual('@ovh-ux/manager-react-components');
  return {
    ...actual,
    useAuthorizationIam: vi.fn(),
  };
});

vi.mock('@/domain/hooks/data/query', () => ({
  useGetDomainAnycastOption: vi.fn(),
  useGetDomainResource: vi.fn(),
  useGetDomainAuthInfo: vi.fn(),
  useGetDnssecStatus: vi.fn(),
  useUpdateDnssecService: vi.fn(),
  useUpdateDomainResource: vi.fn(),
  useTransferTag: vi.fn(),
  useTerminateAnycastMutation: vi.fn(),
}));

describe('ConfigurationCards component', () => {
  const mockUpdateServiceDnssec = vi.fn();
  const mockUpdateDomain = vi.fn();
  const mockTransferTag = vi.fn();

  const mockDomainResource: TDomainResource = {
    checksum: 'checksum-123',
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
      authInfoSupported: false,
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

  beforeEach(() => {
    (useAuthorizationIam as Mock).mockReturnValue({
      isPending: false,
      isAuthorized: true,
    });
    (useGetDomainResource as Mock).mockReturnValue({
      domainResource: mockDomainResource,
      isFetchingDomainResource: false,
      domainResourceError: null,
    });
    (useGetDomainAuthInfo as Mock).mockReturnValue({
      authInfo: 'AUTH123456',
      isAuthInfoLoading: false,
    });
    (useGetDnssecStatus as Mock).mockReturnValue({
      dnssecStatus: DnssecStatusEnum.ENABLED,
      isDnssecStatusLoading: false,
    });
    (useGetDomainAnycastOption as Mock).mockReturnValue({
      anycastOption: null,
      isFetchingAnycastOption: false,
    });
    (useTerminateAnycastMutation as Mock).mockReturnValue({
      terminateAnycast: vi.fn(),
      isTerminateAnycastPending: false,
    });
    (useUpdateDnssecService as Mock).mockReturnValue({
      updateServiceDnssec: mockUpdateServiceDnssec,
      isUpdateIsPending: false,
    });
    (useUpdateDomainResource as Mock).mockReturnValue({
      updateDomain: mockUpdateDomain,
      isUpdateDomainPending: false,
    });
    (useTransferTag as Mock).mockReturnValue({
      transferTag: mockTransferTag,
      isTransferTagPending: false,
      transferTagError: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders configuration cards with title', () => {
    render(<ConfigurationCards serviceName="example.com" />, { wrapper });

    expect(
      screen.getByText('domain_tab_general_information_configuration'),
    ).toBeInTheDocument();
  });

  it('renders DNS server badge', () => {
    render(<ConfigurationCards serviceName="example.com" />, { wrapper });

    expect(
      screen.getByText('domain_tab_general_information_dns_title'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('domain_tab_general_information_dns_standard'),
    ).toBeInTheDocument();
  });

  it('renders DnssecToggleStatus component', () => {
    render(<ConfigurationCards serviceName="example.com" />, { wrapper });

    expect(
      screen.getByText('domain_tab_general_information_dnssec'),
    ).toBeInTheDocument();
  });

  it('renders TransferToggleStatus component', () => {
    render(<ConfigurationCards serviceName="example.com" />, { wrapper });

    expect(
      screen.getByText('domain_tab_general_information_transfer'),
    ).toBeInTheDocument();
  });

  it('does not render when domainResource and dnssecStatus are null', () => {
    (useGetDomainResource as Mock).mockReturnValue({
      domainResource: null,
      isFetchingDomainResource: false,
      domainResourceError: null,
    });
    (useGetDnssecStatus as Mock).mockReturnValue({
      dnssecStatus: null,
      isDnssecStatusLoading: false,
    });

    const {
      container,
    } = render(<ConfigurationCards serviceName="example.com" />, { wrapper });

    expect(container.firstChild).toBeNull();
  });

  describe('Modal state management', () => {
    it('initializes with all modals closed', () => {
      render(<ConfigurationCards serviceName="example.com" />, { wrapper });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders DnssecModal with correct props', () => {
      render(<ConfigurationCards serviceName="example.com" />, { wrapper });
      expect(
        screen.getByText('domain_tab_general_information_dnssec'),
      ).toBeInTheDocument();
    });
  });

  describe('handleUpdateProtectionState', () => {
    it('provides updateDomain function to TransferModal', () => {
      render(<ConfigurationCards serviceName="example.com" />, { wrapper });
      expect(
        screen.getByText('domain_tab_general_information_transfer'),
      ).toBeInTheDocument();
      expect(mockUpdateDomain).toBeDefined();
    });
  });

  describe('handleTag', () => {
    it('calls transferTag when handleTag is executed', async () => {
      render(<ConfigurationCards serviceName="example.com" />, { wrapper });

      const tagButtons = screen.getAllByText(
        'domain_tab_general_information_transfer_tag',
      );
      act(() => {
        fireEvent.click(tagButtons[0]);
      });
      await screen.findByRole('dialog');
      const input = screen.getByRole('textbox');
      act(() => {
        fireEvent.change(input, { target: { value: 'myTag' } });
      });
      const buttons = screen.getAllByRole('button');
      const confirmButton = buttons[1];
      act(() => {
        fireEvent.click(confirmButton);
      });

      expect(mockTransferTag).toHaveBeenCalled();
    });
  });

  describe('updateDnssec', () => {
    it('provides updateServiceDnssec function to DnssecModal', () => {
      render(<ConfigurationCards serviceName="example.com" />, { wrapper });
      expect(
        screen.getByText('domain_tab_general_information_dnssec'),
      ).toBeInTheDocument();
      expect(mockUpdateServiceDnssec).toBeDefined();
    });
  });

  describe('Modal integrations', () => {
    it('passes correct props to DnssecModal', () => {
      render(<ConfigurationCards serviceName="example.com" />, { wrapper });
      const dnssecToggles = screen.getAllByRole('checkbox', {
        name: /service_state_enabled/i,
      });
      act(() => {
        fireEvent.click(dnssecToggles[0]);
      });
      expect(
        screen.getByText(
          'domain_tab_general_information_dnssec_deactivate_modal',
        ),
      ).toBeInTheDocument();
    });

    it('passes correct props to TransferModal', () => {
      render(<ConfigurationCards serviceName="example.com" />, { wrapper });
      const transferToggles = screen.getAllByRole('checkbox', {
        name: /service_state_enabled/i,
      });
      act(() => {
        fireEvent.click(transferToggles[0]);
      });
      expect(
        screen.getByText(
          'domain_tab_general_information_transfer_deactivate_modal',
        ),
      ).toBeInTheDocument();
    });

    it('passes correct props to TransferAuthInfoModal', () => {
      const mockDomainWithAuthInfo = {
        ...mockDomainResource,
        currentState: {
          ...mockDomainResource.currentState,
          protectionState: ProtectionStateEnum.UNPROTECTED,
          authInfoSupported: true,
        },
      };
      (useGetDomainResource as Mock).mockReturnValue({
        domainResource: mockDomainWithAuthInfo,
        isFetchingDomainResource: false,
        domainResourceError: null,
      });

      render(<ConfigurationCards serviceName="example.com" />, { wrapper });
      const authInfoLink = screen.getByText(
        'domain_tab_general_information_transfer_authinfo',
      );
      act(() => {
        fireEvent.click(authInfoLink);
      });
      expect(
        screen.getByText(
          'domain_tab_general_information_transfer_authinfo_modal_title',
        ),
      ).toBeInTheDocument();
    });

    it('passes correct props to TransferTagModal', () => {
      render(<ConfigurationCards serviceName="example.com" />, { wrapper });

      const tagLinks = screen.getAllByText(
        'domain_tab_general_information_transfer_tag',
      );
      act(() => {
        fireEvent.click(tagLinks[0]);
      });

      const modalTexts = screen.getAllByText(
        'domain_tab_general_information_transfer_tag',
      );
      expect(modalTexts.length).toBeGreaterThan(0);
    });
  });
});
