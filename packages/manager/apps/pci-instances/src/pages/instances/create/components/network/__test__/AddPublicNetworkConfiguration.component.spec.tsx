import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddPublicNetworkConfiguration from '../AddPublicNetworkConfiguration.component';
import { renderWithMockedWrappers } from '@/__tests__/wrapperRenders';
import { TestCreateInstanceFormWrapper } from '@/__tests__/CreateInstanceFormWrapper';
import {
  mockedFloatingIpEntity,
  mockedNetworkCatalog,
  mockedPrivateNetworks,
} from '@/__mocks__/instance/constants';
import { getFloatingIps } from '@/data/api/floatingIps';
import { getNetworkCatalog } from '@/data/api/networkCatalog';

const getNetworkCatalogMock = vi.fn();
const getFloatingIpsMock = vi.fn();

vi.mock('@/data/api/networkCatalog');
vi.mocked(getNetworkCatalog).mockImplementation(getNetworkCatalogMock);

vi.mock('@/data/api/floatingIps');
vi.mocked(getFloatingIps).mockImplementation(getFloatingIpsMock);

const setupTest = ({
  networkId = null,
  microRegion = 'fake-region',
}: {
  microRegion?: string | null;
  networkId?: string | null;
} = {}) => {
  getNetworkCatalogMock.mockReturnValue(mockedNetworkCatalog);
  getFloatingIpsMock.mockReturnValue(mockedFloatingIpEntity);

  renderWithMockedWrappers(
    <TestCreateInstanceFormWrapper
      defaultValues={{
        microRegion,
        networkId,
      }}
    >
      <AddPublicNetworkConfiguration subnets={mockedPrivateNetworks} />
    </TestCreateInstanceFormWrapper>,
  );
};

describe('Considering AddPublicNetworkConfiguration component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have connectivity public checked by default', async () => {
    setupTest();

    await waitFor(() => {
      expect(
        screen.getByLabelText(
          /creation:pci_instance_creation_network_add_public_connectivity.toggle_label/i,
        ),
      ).toBeChecked();
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
      networkId: mockedPrivateNetworks[1]?.value,
    });

    await waitFor(() => {
      expect(
        screen.getByLabelText(
          /creation:pci_instance_creation_network_add_public_connectivity.floating_ip_label/i,
        ),
      ).toBeChecked();

      expect(
        screen.getByText(
          /creation:pci_instance_creation_network_add_public_connectivity.basic_ip_warning/i,
        ),
      ).toBeVisible();
    });
  });

  it('should disable floating IP when selected region is localZone', async () => {
    setupTest({
      microRegion: 'fake-LZ',
    });

    await waitFor(() => {
      expect(
        screen.getByLabelText(
          /creation:pci_instance_creation_network_add_public_connectivity.floating_ip_label/i,
        ),
      ).toBeDisabled();
    });
  });
});
