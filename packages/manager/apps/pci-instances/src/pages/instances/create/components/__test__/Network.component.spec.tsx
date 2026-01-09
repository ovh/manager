import { describe, expect, it, vi } from 'vitest';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Network from '../Network.component';
import { renderWithMockedWrappers } from '@/__tests__/wrapperRenders';
import {
  mockedOvhPrivateNetwork,
  mockedPrivateNetworks,
} from '@/__mocks__/instance/constants';
import { selectPrivateNetworks } from '../../view-models/networksViewModel';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { TestCreateInstanceFormWrapper } from '@/__tests__/CreateInstanceFormWrapper';

const selectPrivateNetworksMock = vi.fn();

const NETWORK_ID = mockedPrivateNetworks[0]?.value;

const NETWORK_NAME = 'fake-name';
const DEFAULT_VLAN_ID = 24;
const DEFAULT_CIDR = '10.1.0.0/16';

vi.mock('../../view-models/networksViewModel');
vi.mocked(selectPrivateNetworks).mockImplementation(selectPrivateNetworksMock);

type TNetworkItem = { label: string; value: string };

const setupTest = (
  { networks }: { networks: TNetworkItem[] } = { networks: [] },
) => {
  selectPrivateNetworksMock.mockReturnValue({
    networks,
    ovhPrivateNetwork: mockedOvhPrivateNetwork,
  });

  renderWithMockedWrappers(
    <TestCreateInstanceFormWrapper
      defaultValues={{
        networkId: NETWORK_ID,
        newPrivateNetwork: {
          name: NETWORK_NAME,
          cidr: DEFAULT_CIDR,
          vlanId: DEFAULT_VLAN_ID,
          enableDhcp: true,
        },
      }}
    >
      <Network />
    </TestCreateInstanceFormWrapper>,
  );
};

describe('Considering Network component', () => {
  it('should not display neither the dropdown nor the create private network button when networks do not yet exists', () => {
    setupTest();

    expect(
      screen.queryByText(
        'creation:pci_instance_creation_select_network_dropdown_label',
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('creation:pci_instance_creation_network_add_new'),
    ).not.toBeInTheDocument();
  });

  it('should display creation form directly when networks do not yet exists', () => {
    setupTest();

    expect(
      screen.getByRole('form', {
        name: 'creation:pci_instance_creation_network_add_new',
      }),
    ).toBeVisible();
    expect(
      screen.queryByText(`${NAMESPACES.ACTIONS}:cancel`),
    ).not.toBeInTheDocument();
  });

  it('should display dropdown and select the first existing network when it exists', async () => {
    setupTest({ networks: mockedPrivateNetworks });

    const defaultNetwork = mockedPrivateNetworks[0];

    const options = screen.getAllByText(defaultNetwork!.label);
    const optionWithValue = options.find((option) =>
      option.hasAttribute('selected'),
    );

    mockedPrivateNetworks.forEach(({ label, value }) => {
      const options = screen.getAllByText(label);
      const optionWithValue = options.find(
        (option) => option.getAttribute('value') === value,
      );

      expect(optionWithValue).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          'creation:pci_instance_creation_select_network_dropdown_label',
        ),
      ).toBeVisible();
      expect(optionWithValue).toHaveValue(defaultNetwork!.value);
    });
  });

  it('should display create new Private Network button when networks exists', () => {
    setupTest({ networks: mockedPrivateNetworks });

    expect(
      screen.getByText('creation:pci_instance_creation_network_add_new'),
    ).toBeVisible();
  });

  it('should not display creation form until create button is clicked when networks exist', () => {
    setupTest({ networks: mockedPrivateNetworks });

    expect(
      screen.queryByRole('form', {
        name: 'creation:pci_instance_creation_network_add_new',
      }),
    ).not.toBeInTheDocument();
  });

  it('should display create new Private Network form when click on btn', async () => {
    setupTest({ networks: mockedPrivateNetworks });

    await act(async () => {
      await userEvent.click(
        screen.getByText('creation:pci_instance_creation_network_add_new'),
      );
    });

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
    setupTest({ networks: mockedPrivateNetworks });

    await act(async () => {
      await userEvent.click(
        screen.getByText('creation:pci_instance_creation_network_add_new'),
      );
    });

    expect(screen.getByText(`${NAMESPACES.ACTIONS}:cancel`)).toBeVisible();
  });

  it('should close creation form when click on cancel', async () => {
    setupTest({ networks: mockedPrivateNetworks });

    await act(async () => {
      await userEvent.click(
        screen.getByText('creation:pci_instance_creation_network_add_new'),
      );
    });

    await act(async () => {
      await userEvent.click(screen.getByText(`${NAMESPACES.ACTIONS}:cancel`));
    });

    expect(
      screen.queryByRole('form', {
        name: 'creation:pci_instance_creation_network_add_new',
      }),
    ).not.toBeInTheDocument();
  });
});
