import { describe, expect, it } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddNetworkForm from '../network/AddNetworkForm.component';

const NETWORK_NAME = 'fake-name';
const DEFAULT_VLAN_ID = 24;
const DEFAULT_CIDR = '10.1.0.0/16';

const renderNetwork = () =>
  render(
    <AddNetworkForm
      values={{
        name: NETWORK_NAME,
        cidr: DEFAULT_CIDR,
        vlanId: DEFAULT_VLAN_ID,
        enableDhcp: true,
      }}
    />,
  );

describe('Considering AddNetwork component', () => {
  it('should display pn-region-ddmmyyyy format as private network name default value', () => {
    renderNetwork();

    expect(
      screen.getByLabelText(
        'creation:pci_instance_creation_network_add_new_name_label_form',
      ),
    ).toHaveValue(NETWORK_NAME);
  });

  it('should invalidate private name field when it is empty', async () => {
    renderNetwork();

    const input = screen.getByLabelText(
      'creation:pci_instance_creation_network_add_new_name_label_form',
    );

    await act(async () => {
      await userEvent.clear(input);
    });

    expect(input).toBeInvalid();
  });

  it('should invalidate private name field when it is more than 255 characters', async () => {
    renderNetwork();

    const input = screen.getByLabelText(
      'creation:pci_instance_creation_network_add_new_name_label_form',
    );

    fireEvent.change(input, { target: { value: 'abc'.repeat(134) } });

    await waitFor(() => {
      expect(input).toBeInvalid();
    });
  });

  it('should display default vlanId', () => {
    renderNetwork();

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
    render(
      <AddNetworkForm
        values={{
          name: NETWORK_NAME,
          cidr: DEFAULT_CIDR,
          vlanId: DEFAULT_VLAN_ID,
          enableDhcp: true,
        }}
        takenVlanIds={[40]}
      />,
    );

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
    renderNetwork();

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
    renderNetwork();

    const input = screen.getByLabelText(
      'creation:pci_instance_creation_network_add_new_vlanID_label_form',
    );

    fireEvent.change(input, { target: { value: 5000 } });

    await waitFor(() => {
      expect(input).toBeInvalid();
    });
  });

  it('should display default cidr', () => {
    renderNetwork();

    expect(
      screen.getByLabelText(
        'creation:pci_instance_creation_network_add_new_cidr_label_form',
      ),
    ).toHaveValue(DEFAULT_CIDR);
  });

  it('should invalidate cidr field when value is not formatted as a ip/mask', async () => {
    renderNetwork();

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
    renderNetwork();

    const input = screen.getByLabelText(
      'creation:pci_instance_creation_network_add_new_cidr_label_form',
    );

    await act(async () => {
      await userEvent.clear(input);
    });

    expect(input).toBeInvalid();
  });

  it('should checked by default the dhcp field', () => {
    renderNetwork();

    expect(
      screen.getByLabelText(
        'creation:pci_instance_creation_network_add_new_dhcp_label_form',
      ),
    ).toBeChecked();
  });
});
