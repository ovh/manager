import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithMockedWrappers } from '@/__tests__/wrapperRenders';
import {
  mockedPrivateNetworks,
  mockedGatewayConfiguration,
  mockedBasicPublicIpConfiguration,
  mockedFloatingIpConfiguration,
  mockedExistingFloatingIps,
} from '@/__mocks__/instance/constants';
import { TestCreateInstanceFormWrapper } from '@/__tests__/CreateInstanceFormWrapper';
import { selectPublicNetworkConfig } from '../../../view-models/networksViewModel';
import PublicIpConfiguration from '../PublicIpConfiguration.component';

type TSetupTestProps = {
  networkId?: string | null;
  microRegion?: string | null;
  basicPublicIpDisabled?: boolean;
  floatingIpDisabled?: boolean;
  gatewayDisabled?: boolean;
  ipPublicType?: 'basicIp' | 'floatingIp' | null;
  floatingIpAssignment?: 'createNew' | 'reuseExisting' | null;
};

vi.mock('../../../view-models/networksViewModel');

const setupTest = ({
  networkId = null,
  microRegion = 'fake-region',
  basicPublicIpDisabled = false,
  floatingIpDisabled = false,
  gatewayDisabled = false,
  ipPublicType = null,
  floatingIpAssignment = null,
}: TSetupTestProps = {}) => {
  vi.mocked(selectPublicNetworkConfig).mockReturnValue({
    gateway: {
      ...mockedGatewayConfiguration,
      isDisabled: gatewayDisabled,
    },
    basicPublicIp: {
      ...mockedBasicPublicIpConfiguration,
      isDisabled: basicPublicIpDisabled,
    },
    floatingIp: {
      ...mockedFloatingIpConfiguration,
      isDisabled: floatingIpDisabled,
      existingFloatingIps: mockedExistingFloatingIps,
    },
  });

  renderWithMockedWrappers(
    <TestCreateInstanceFormWrapper
      defaultValues={{
        networkId,
        microRegion,
        assignNewGateway: false,
        ipPublicType,
        floatingIpAssignment,
        existingFloatingIp: null,
      }}
    >
      <PublicIpConfiguration />
    </TestCreateInstanceFormWrapper>,
  );
};

describe('Considering PublicIpConfiguration component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should disable basic public IP when selected network has gateway', async () => {
    setupTest({
      networkId: mockedPrivateNetworks[1]?.value,
      basicPublicIpDisabled: true,
    });

    await waitFor(() => {
      expect(
        screen.getByLabelText(
          /creation:pci_instance_creation_network_add_public_connectivity.basic_ip_label/i,
        ),
      ).toBeDisabled();
    });
  });

  it('should disable floating IP when selected region is localZone', async () => {
    setupTest({
      microRegion: 'fake-LZ',
      floatingIpDisabled: true,
    });

    await waitFor(() => {
      expect(
        screen.getByLabelText(
          /creation:pci_instance_creation_network_add_public_connectivity.floating_ip_label/i,
        ),
      ).toBeDisabled();
    });
  });

  it('should display create new IP and reuse existing floating IP radios when floating IP is selected', async () => {
    setupTest();

    await userEvent.click(
      screen.getByLabelText(
        /creation:pci_instance_creation_network_add_public_connectivity.floating_ip_label/i,
      ),
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          /creation:pci_instance_creation_network_add_public_connectivity.floating_ip_create_new_label/i,
        ),
      ).toBeVisible();

      expect(
        screen.getByText(
          /creation:pci_instance_creation_network_add_public_connectivity.floating_ip_reuse_existing_label/i,
        ),
      ).toBeVisible();
    });
  });

  it('should display select with all existing IPs when reuse existing is selected', async () => {
    setupTest();

    await userEvent.click(
      screen.getByLabelText(
        /creation:pci_instance_creation_network_add_public_connectivity.floating_ip_label/i,
      ),
    );

    await userEvent.click(
      screen.getByLabelText(
        /creation:pci_instance_creation_network_add_public_connectivity.floating_ip_reuse_existing_label/i,
      ),
    );

    const verifyFloatingIpOption = (label: string, value: string) => {
      const options = screen.getAllByText(label);
      const optionWithValue = options.find(
        (option) => option.getAttribute('value') === value,
      );
      expect(optionWithValue).toBeInTheDocument();
    };

    await waitFor(() => {
      for (const { label, value } of mockedExistingFloatingIps) {
        verifyFloatingIpOption(label, value);
      }
    });
  });

  it('should checked by default create new floating ip', async () => {
    setupTest();

    await userEvent.click(
      screen.getByLabelText(
        /creation:pci_instance_creation_network_add_public_connectivity.floating_ip_label/i,
      ),
    );

    await waitFor(() => {
      expect(
        screen.getByLabelText(
          /creation:pci_instance_creation_network_add_public_connectivity.floating_ip_create_new_label/i,
        ),
      ).toBeChecked();
    });
  });

  it('should hide create new floating ip when ip public type changes to basicIp', async () => {
    setupTest({
      ipPublicType: 'floatingIp',
    });

    await userEvent.click(
      screen.getByLabelText(
        /creation:pci_instance_creation_network_add_public_connectivity.basic_ip_label/i,
      ),
    );

    await waitFor(() => {
      expect(
        screen.queryByText(
          /creation:pci_instance_creation_network_add_public_connectivity.floating_ip_create_new_label/i,
        ),
      ).not.toBeInTheDocument();
    });
  });

  it('should display warning message on basic ip label when gateway is disabled', async () => {
    setupTest({
      gatewayDisabled: true,
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          /creation:pci_instance_creation_network_add_public_connectivity.basic_ip_warning/i,
        ),
      ).toBeVisible();
    });
  });

  it('should warn user that a gateway will be assigned when floating ip is selected and if gateway is not disabled', async () => {
    setupTest({
      ipPublicType: 'floatingIp',
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          /creation:pci_instance_creation_network_add_public_connectivity.floating_ip_warning/i,
        ),
      ).toBeVisible();
    });
  });
});
