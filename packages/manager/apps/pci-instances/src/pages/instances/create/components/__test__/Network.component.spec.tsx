import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Network from '../Network.component';
import { renderWithMockedWrappers } from '@/__tests__/wrapperRenders';
import { mockedPrivateNetworkEntity } from '@/__mocks__/instance/constants';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { TestCreateInstanceFormWrapper } from '@/__tests__/CreateInstanceFormWrapper';
import { getPrivateNetworks } from '@/data/api/privateNetworks';
import { TPrivateNetwork } from '@/domain/entities/configuration';

const getPrivateNetworksMock = vi.fn();

const NETWORK_NAME = 'fake-name';
const DEFAULT_VLAN_ID = 24;
const DEFAULT_CIDR = '10.1.0.0/16';

vi.mock(
  '@/pages/instances/create/components/network/GatewayConfiguration.component',
);
vi.mock(
  '@/pages/instances/create/components/network/AddPublicNetworkConfiguration.component',
);

vi.mock('@/data/api/privateNetworks');
vi.mocked(getPrivateNetworks).mockImplementation(getPrivateNetworksMock);

const setupTest = (
  { networks }: { networks: TPrivateNetwork | null } = {
    networks: mockedPrivateNetworkEntity,
  },
) => {
  getPrivateNetworksMock.mockReturnValue(networks);

  renderWithMockedWrappers(
    <TestCreateInstanceFormWrapper
      defaultValues={{
        microRegion: 'BHS5',
        newPrivateNetwork: {
          name: NETWORK_NAME,
          cidr: DEFAULT_CIDR,
          vlanId: DEFAULT_VLAN_ID,
          enableDhcp: true,
        },
        ipPublicType: null,
        assignNewGateway: false,
      }}
    >
      <Network />
    </TestCreateInstanceFormWrapper>,
  );
};

describe('Considering Network component', () => {
  it('should not display neither the dropdown nor the create private network button when networks do not yet exists', async () => {
    setupTest({ networks: null });

    await waitFor(() => {
      expect(
        screen.queryByText(
          'creation:pci_instance_creation_select_network_dropdown_label',
        ),
      ).not.toBeInTheDocument();

      expect(
        screen.queryByText('creation:pci_instance_creation_network_add_new'),
      ).not.toBeInTheDocument();
    });
  });

  it('should display creation form directly when networks do not yet exists', async () => {
    setupTest({ networks: null });

    await waitFor(() => {
      expect(
        screen.getByRole('form', {
          name: 'creation:pci_instance_creation_network_add_new',
        }),
      ).toBeVisible();

      expect(
        screen.queryByText(`${NAMESPACES.ACTIONS}:cancel`),
      ).not.toBeInTheDocument();
    });
  });

  it('should display dropdown and select the first existing network when it exists', async () => {
    setupTest();

    await waitFor(() => {
      const options = screen.getAllByText('test-network-1');
      // eslint-disable-next-line max-nested-callbacks
      const optionWithValue = options.find((option) =>
        option.hasAttribute('selected'),
      );

      expect(optionWithValue).toBeInTheDocument();

      expect(
        screen.getByText(
          'creation:pci_instance_creation_select_network_dropdown_label',
        ),
      ).toBeVisible();

      expect(optionWithValue).toHaveValue(
        '22defd89-ab74-4353-8676-6a0ad7a239d3',
      );
    });
  });

  it('should display create new Private Network button when networks exists', async () => {
    setupTest();

    await waitFor(() => {
      expect(
        screen.getByText('creation:pci_instance_creation_network_add_new'),
      ).toBeVisible();
    });
  });

  it('should not display creation form until create button is clicked when networks exist', async () => {
    setupTest();

    await waitFor(() => {
      expect(
        screen.queryByRole('form', {
          name: 'creation:pci_instance_creation_network_add_new',
        }),
      ).not.toBeInTheDocument();
    });
  });

  it('should display create new Private Network form when click on btn', async () => {
    setupTest();

    expect(
      screen.queryByRole('form', {
        name: 'creation:pci_instance_creation_network_add_new',
      }),
    ).not.toBeInTheDocument();

    const addNewButton = await screen.findByText(
      'creation:pci_instance_creation_network_add_new',
    );

    await userEvent.click(addNewButton);

    await waitFor(() => {
      expect(useOvhTracking().trackClick).toHaveBeenCalledWith({
        location: PageLocation.funnel,
        buttonType: ButtonType.button,
        actionType: 'action',
        actions: ['add_instance', 'create_private_network'],
      });

      expect(
        screen.getByRole('form', {
          name: 'creation:pci_instance_creation_network_add_new',
        }),
      ).toBeVisible();
    });
  });

  it('should display cancel button when form is opened and networks exist', async () => {
    setupTest();

    const addNewButton = await screen.findByText(
      'creation:pci_instance_creation_network_add_new',
    );

    await userEvent.click(addNewButton);

    await waitFor(() => {
      expect(screen.getByText(`${NAMESPACES.ACTIONS}:cancel`)).toBeVisible();
    });
  });

  it('should close creation form when click on cancel', async () => {
    setupTest();

    const addNewButton = await screen.findByText(
      'creation:pci_instance_creation_network_add_new',
    );

    await userEvent.click(addNewButton);

    expect(
      screen.queryByRole('form', {
        name: 'creation:pci_instance_creation_network_add_new',
      }),
    ).toBeVisible();

    await userEvent.click(screen.getByText(`${NAMESPACES.ACTIONS}:cancel`));

    await waitFor(() => {
      expect(
        screen.queryByRole('form', {
          name: 'creation:pci_instance_creation_network_add_new',
        }),
      ).not.toBeInTheDocument();
    });
  });

  it('should display warning message when full private network mode', async () => {
    setupTest();

    await waitFor(() => {
      expect(
        screen.getByText(
          'creation:pci_instance_creation_network_full_private_warning',
        ),
      ).toBeVisible();
    });
  });
});
