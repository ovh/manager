import '@/common/setupTests';
import {
  render,
  screen,
  waitFor,
  act,
  wrapper,
} from '@/common/utils/test.provider';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import DataProtectionDrawer from './DataProtectionDrawer';
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
    contactsConfiguration: {
      contactOwner: {
        id: 'owner-id',
        disclosurePolicy: {
          disclosureConfiguration: DisclosureConfigurationEnum.REDACTED,
          forcedDisclosureConfiguration: false,
          disclosedFields: ['EMAIL', 'NAME'],
          visibleViaRdds: true,
        },
      },
      contactAdministrator: {
        id: 'admin-id',
        disclosurePolicy: {
          disclosureConfiguration: DisclosureConfigurationEnum.DISCLOSED,
          forcedDisclosureConfiguration: false,
          disclosedFields: ['PHONE', 'ADDRESS'],
          visibleViaRdds: true,
        },
      },
      contactTechnical: {
        id: 'tech-id',
        disclosurePolicy: {
          disclosureConfiguration: DisclosureConfigurationEnum.REDACTED,
          forcedDisclosureConfiguration: false,
          disclosedFields: [],
          visibleViaRdds: false,
        },
      },
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

const mockVisibleContacts = [
  {
    key: 'contactOwner',
    id: 'owner-id',
    label: 'Owner',
    disclosedFields: ['EMAIL', 'NAME'],
  },
  {
    key: 'contactAdministrator',
    id: 'admin-id',
    label: 'Administrator',
    disclosedFields: ['PHONE', 'ADDRESS'],
  },
];

describe('DataProtectionDrawer component', () => {
  const mockOnClose = vi.fn();
  const mockOnClick = vi.fn();
  const mockOnCheckboxChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render drawer with title and description', async () => {
    render(
      <DataProtectionDrawer
        isDrawerOpen={true}
        onClose={mockOnClose}
        domainResource={mockDomainResource}
        visibleContacts={mockVisibleContacts}
        selectedContacts={['contactOwner']}
        onCheckboxChange={mockOnCheckboxChange}
        onClick={mockOnClick}
        isUpdateDomainPending={false}
        errorMessage={null}
      />,
      { wrapper },
    );

    await waitFor(() => {
      expect(
        screen.getByText('domain_tab_general_information_data_drawer_title'),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByText(
        'domain_tab_general_information_data_drawer_description',
      ),
    ).toBeInTheDocument();
  });

  it('should render checkboxes for visible contacts', async () => {
    render(
      <DataProtectionDrawer
        isDrawerOpen={true}
        onClose={mockOnClose}
        domainResource={mockDomainResource}
        visibleContacts={mockVisibleContacts}
        selectedContacts={['contactOwner']}
        onCheckboxChange={mockOnCheckboxChange}
        onClick={mockOnClick}
        isUpdateDomainPending={false}
        errorMessage={null}
      />,
      { wrapper },
    );

    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(2);
    });
  });

  it('should check checkbox for selected contacts', async () => {
    render(
      <DataProtectionDrawer
        isDrawerOpen={true}
        onClose={mockOnClose}
        domainResource={mockDomainResource}
        visibleContacts={mockVisibleContacts}
        selectedContacts={['contactOwner']}
        onCheckboxChange={mockOnCheckboxChange}
        onClick={mockOnClick}
        isUpdateDomainPending={false}
        errorMessage={null}
      />,
      { wrapper },
    );

    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
    });
  });

  it('should call onCheckboxChange when checkbox is clicked', async () => {
    const user = userEvent.setup();
    render(
      <DataProtectionDrawer
        isDrawerOpen={true}
        onClose={mockOnClose}
        domainResource={mockDomainResource}
        visibleContacts={mockVisibleContacts}
        selectedContacts={['contactOwner']}
        onCheckboxChange={mockOnCheckboxChange}
        onClick={mockOnClick}
        isUpdateDomainPending={false}
        errorMessage={null}
      />,
      { wrapper },
    );

    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBe(2);
    });

    const checkboxes = screen.getAllByRole('checkbox');
    await act(() => user.click(checkboxes[1]));

    await waitFor(() => {
      expect(mockOnCheckboxChange).toHaveBeenCalledWith(
        'contactAdministrator',
        expect.any(Boolean),
      );
    });
  });

  it('should disable validate button when no contacts are selected', async () => {
    render(
      <DataProtectionDrawer
        isDrawerOpen={true}
        onClose={mockOnClose}
        domainResource={mockDomainResource}
        visibleContacts={mockVisibleContacts}
        selectedContacts={[]}
        onCheckboxChange={mockOnCheckboxChange}
        onClick={mockOnClick}
        isUpdateDomainPending={false}
        errorMessage={null}
      />,
      { wrapper },
    );

    await waitFor(() => {
      const validateButton = screen.getByRole('button', { name: /validate/i });
      expect(validateButton).not.toBeDisabled();
    });
  });

  it('should enable validate button when contacts are selected', async () => {
    render(
      <DataProtectionDrawer
        isDrawerOpen={true}
        onClose={mockOnClose}
        domainResource={mockDomainResource}
        visibleContacts={mockVisibleContacts}
        selectedContacts={['contactOwner']}
        onCheckboxChange={mockOnCheckboxChange}
        onClick={mockOnClick}
        isUpdateDomainPending={false}
        errorMessage={null}
      />,
      { wrapper },
    );

    await waitFor(() => {
      const validateButton = screen.getByRole('button', { name: /validate/i });
      expect(validateButton).not.toBeDisabled();
    });
  });

  it('should call onClick with selected contacts when validate is clicked', async () => {
    const user = userEvent.setup();
    render(
      <DataProtectionDrawer
        isDrawerOpen={true}
        onClose={mockOnClose}
        domainResource={mockDomainResource}
        visibleContacts={mockVisibleContacts}
        selectedContacts={['contactOwner', 'contactAdministrator']}
        onCheckboxChange={mockOnCheckboxChange}
        onClick={mockOnClick}
        isUpdateDomainPending={false}
        errorMessage={null}
      />,
      { wrapper },
    );

    const validateButton = screen.getByRole('button', { name: /validate/i });
    await act(() => user.click(validateButton));

    expect(mockOnClick).toHaveBeenCalledWith([
      'contactOwner',
      'contactAdministrator',
    ]);
  });

  it('should call onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <DataProtectionDrawer
        isDrawerOpen={true}
        onClose={mockOnClose}
        domainResource={mockDomainResource}
        visibleContacts={mockVisibleContacts}
        selectedContacts={['contactOwner']}
        onCheckboxChange={mockOnCheckboxChange}
        onClick={mockOnClick}
        isUpdateDomainPending={false}
        errorMessage={null}
      />,
      { wrapper },
    );

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /cancel/i }),
      ).toBeInTheDocument();
    });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await act(() => user.click(cancelButton));

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should render empty state when no visible contacts', async () => {
    render(
      <DataProtectionDrawer
        isDrawerOpen={true}
        onClose={mockOnClose}
        domainResource={mockDomainResource}
        visibleContacts={[]}
        selectedContacts={[]}
        onCheckboxChange={mockOnCheckboxChange}
        onClick={mockOnClick}
        isUpdateDomainPending={false}
        errorMessage={null}
      />,
      { wrapper },
    );

    await waitFor(() => {
      const checkboxes = screen.queryAllByRole('checkbox');
      expect(checkboxes).toHaveLength(0);
    });
  });
});
