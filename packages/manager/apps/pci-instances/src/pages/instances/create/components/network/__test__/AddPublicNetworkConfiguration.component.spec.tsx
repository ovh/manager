import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddPublicNetworkConfiguration from '../AddPublicNetworkConfiguration.component';
import { renderWithMockedWrappers } from '@/__tests__/wrapperRenders';
import {
  mockedGatewayConfiguration,
  mockedBasicPublicIpConfiguration,
  mockedFloatingIpConfiguration,
  mockedExistingFloatingIps,
} from '@/__mocks__/instance/constants';
import { TestCreateInstanceFormWrapper } from '@/__tests__/CreateInstanceFormWrapper';
import { selectPublicNetworkConfig } from '../../../view-models/networksViewModel';

vi.mock('../../../view-models/networksViewModel');

const setupTest = ({
  basicPublicIpDisabled = false,
}: {
  basicPublicIpDisabled?: boolean;
} = {}) => {
  vi.mocked(selectPublicNetworkConfig).mockReturnValue({
    gateway: {
      ...mockedGatewayConfiguration,
      isDisabled: false,
    },
    basicPublicIp: {
      ...mockedBasicPublicIpConfiguration,
      isDisabled: basicPublicIpDisabled,
    },
    floatingIp: {
      ...mockedFloatingIpConfiguration,
      isDisabled: false,
      existingFloatingIps: mockedExistingFloatingIps,
    },
  });

  renderWithMockedWrappers(
    <TestCreateInstanceFormWrapper
      defaultValues={{
        microRegion: 'fake-region',
      }}
    >
      <AddPublicNetworkConfiguration />
    </TestCreateInstanceFormWrapper>,
  );
};

describe('Considering AddPublicNetworkConfiguration component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should checked by default assign public IP toggle', async () => {
    setupTest();

    await waitFor(() => {
      expect(
        screen.getByLabelText(
          /creation:pci_instance_creation_network_add_public_connectivity.toggle_label/i,
        ),
      ).toBeChecked();

      expect(
        screen.queryByText(
          /creation:pci_instance_creation_network_add_public_connectivity.basic_ip_label/i,
        ),
      ).toBeVisible();

      expect(
        screen.queryByText(
          /creation:pci_instance_creation_network_add_public_connectivity.floating_ip_label/i,
        ),
      ).toBeVisible();
    });
  });

  it('should hide basic public IP and floating IP blocks when toggle is off', async () => {
    setupTest();

    const toggle = screen.getByLabelText(
      /creation:pci_instance_creation_network_add_public_connectivity.toggle_label/i,
    );

    expect(toggle).toBeChecked();

    await userEvent.click(toggle);

    await waitFor(() => {
      expect(toggle).not.toBeChecked();

      expect(
        screen.queryByText(
          /creation:pci_instance_creation_network_add_public_connectivity.basic_ip_label/i,
        ),
      ).not.toBeInTheDocument();

      expect(
        screen.queryByText(
          /creation:pci_instance_creation_network_add_public_connectivity.floating_ip_label/i,
        ),
      ).not.toBeInTheDocument();
    });
  });

  it('should checked floating ip when basic ip is disabled', async () => {
    setupTest({
      basicPublicIpDisabled: true,
    });

    await waitFor(() => {
      expect(
        screen.getByLabelText(
          /creation:pci_instance_creation_network_add_public_connectivity.floating_ip_label/i,
        ),
      ).toBeChecked();
    });
  });
});
