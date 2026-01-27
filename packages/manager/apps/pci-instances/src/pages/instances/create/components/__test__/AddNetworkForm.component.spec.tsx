import { describe, expect, it } from 'vitest';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddNetworkForm from '../network/AddNetworkForm.component';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { TestCreateInstanceFormWrapper } from '@/__tests__/CreateInstanceFormWrapper';
import { renderWithMockedWrappers } from '@/__tests__/wrapperRenders';

const NETWORK_NAME = 'fake-name';
const DEFAULT_VLAN_ID = 24;
const DEFAULT_CIDR = '10.1.0.0/16';

type TRenderNetworkProps = {
  takenVlanIds: number[];
};

const setupTest = (
  { takenVlanIds }: TRenderNetworkProps = { takenVlanIds: [] },
) => {
  renderWithMockedWrappers(
    <TestCreateInstanceFormWrapper
      defaultValues={{
        networkId: 'fake-networkId',
        newPrivateNetwork: {
          name: NETWORK_NAME,
          cidr: DEFAULT_CIDR,
          vlanId: DEFAULT_VLAN_ID,
          enableDhcp: true,
        },
      }}
    >
      <AddNetworkForm takenVlanIds={takenVlanIds} />
    </TestCreateInstanceFormWrapper>,
  );
};

describe('Considering AddNetwork component', () => {
  it('should display pn-region-ddmmyyyy format as private network name default value', () => {
    setupTest();

    expect(
      screen.getByLabelText(
        'creation:pci_instance_creation_network_add_new_name_label_form',
      ),
    ).toHaveValue(NETWORK_NAME);
  });

  it('should invalidate private name field when it is empty', async () => {
    setupTest();

    const input = screen.getByLabelText(
      'creation:pci_instance_creation_network_add_new_name_label_form',
    );

    await act(async () => {
      await userEvent.clear(input);
    });

    expect(input).toBeInvalid();
    expect(
      screen.getByText(`${NAMESPACES.FORM}:error_required_field`),
    ).toBeVisible();
  });

  it('should invalidate private name field when it is more than 255 characters', async () => {
    setupTest();

    const input = screen.getByLabelText(
      'creation:pci_instance_creation_network_add_new_name_label_form',
    );

    await act(async () => {
      await userEvent.type(input, 'abc'.repeat(134));
    });

    await waitFor(() => {
      expect(input).toBeInvalid();
    });
  });

  it('should display default vlanId', () => {
    setupTest();

    expect(
      screen.getByLabelText(
        'creation:pci_instance_creation_network_add_new_vlanID_label_form',
      ),
    ).toHaveValue(DEFAULT_VLAN_ID);

    expect(
      screen.queryByText(
        'creation:pci_instance_creation_network_add_new_used_vlanID_warning',
      ),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText(
        'creation:pci_instance_creation_network_add_new_vlanID_warning',
      ),
    ).not.toBeInTheDocument();
  });

  it('should display warning message when vlanId is already used', async () => {
    setupTest({ takenVlanIds: [40] });

    fireEvent.change(
      screen.getByLabelText(
        'creation:pci_instance_creation_network_add_new_vlanID_label_form',
      ),
      { target: { value: 40 } },
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          'creation:pci_instance_creation_network_add_new_used_vlanID_warning',
        ),
      ).toBeVisible();
    });
  });

  it('should display warning message when vlanId = 0', async () => {
    setupTest();

    fireEvent.change(
      screen.getByLabelText(
        'creation:pci_instance_creation_network_add_new_vlanID_label_form',
      ),
      { target: { value: 0 } },
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          'creation:pci_instance_creation_network_add_new_vlanID_warning',
        ),
      ).toBeVisible();
    });
  });

  it('should invalidate vlanId field when value is greater than 4000', async () => {
    setupTest();

    const input = screen.getByLabelText(
      'creation:pci_instance_creation_network_add_new_vlanID_label_form',
    );

    fireEvent.change(input, { target: { value: 5000 } });

    await waitFor(() => {
      expect(input).toBeInvalid();
    });
  });

  it('should display default cidr', () => {
    setupTest();

    expect(
      screen.getByLabelText(
        'creation:pci_instance_creation_network_add_new_cidr_label_form',
      ),
    ).toHaveValue(DEFAULT_CIDR);
  });

  it('should invalidate cidr field when value is not formatted as a ip/mask', async () => {
    setupTest();

    const input = screen.getByLabelText(
      'creation:pci_instance_creation_network_add_new_cidr_label_form',
    );

    fireEvent.change(input, { target: { value: 'fake-cidr' } });

    await waitFor(() => {
      expect(input).toBeInvalid();
      expect(
        screen.getByText(
          'creation:pci_instance_creation_network_add_new_cidr_error',
        ),
      ).toBeVisible();
    });
  });

  it('should invalidate cidr field when it is empty', async () => {
    setupTest();

    const input = screen.getByLabelText(
      'creation:pci_instance_creation_network_add_new_cidr_label_form',
    );

    await act(async () => {
      await userEvent.clear(input);
    });

    expect(input).toBeInvalid();
  });

  it('should checked by default the dhcp field', () => {
    setupTest();

    expect(
      screen.getByLabelText(
        'creation:pci_instance_creation_network_add_new_dhcp_label_form',
      ),
    ).toBeChecked();
  });
});
