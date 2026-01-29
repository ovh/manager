import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithMockedWrappers } from '@/__tests__/wrapperRenders';
import {
  mockedPrivateNetworks,
  mockedFloatingIpEntity,
  mockedNetworkCatalog,
  mockedExistingFloatingIps,
} from '@/__mocks__/instance/constants';
import { TestCreateInstanceFormWrapper } from '@/__tests__/CreateInstanceFormWrapper';
import PublicIpConfiguration from '../PublicIpConfiguration.component';
import { getNetworkCatalog } from '@/data/api/networkCatalog';
import { getFloatingIps } from '@/data/api/floatingIps';

const getNetworkCatalogMock = vi.fn();
const getFloatingIpsMock = vi.fn();

vi.mock('@/data/api/networkCatalog');
vi.mocked(getNetworkCatalog).mockImplementation(getNetworkCatalogMock);

vi.mock('@/data/api/floatingIps');
vi.mocked(getFloatingIps).mockImplementation(getFloatingIpsMock);

const setupTest = () => {
  getNetworkCatalogMock.mockReturnValue(mockedNetworkCatalog);
  getFloatingIpsMock.mockReturnValue(mockedFloatingIpEntity);

  renderWithMockedWrappers(
    <TestCreateInstanceFormWrapper
      defaultValues={{
        microRegion: 'fake-region',
      }}
    >
      <PublicIpConfiguration subnets={mockedPrivateNetworks} />
    </TestCreateInstanceFormWrapper>,
  );
};

describe('Considering PublicIpConfiguration component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should checked by default assign public IP toggle', async () => {
    setupTest();

    await waitFor(() => {
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

  it('should display create new IP and reuse existing floating IP radios when floating IP is selected', async () => {
    setupTest();

    const radio = await screen.findByLabelText(
      /creation:pci_instance_creation_network_add_public_connectivity.floating_ip_label/i,
    );

    await userEvent.click(radio);

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

    const floatingIpRadio = await screen.findByLabelText(
      /creation:pci_instance_creation_network_add_public_connectivity.floating_ip_label/i,
    );

    await userEvent.click(floatingIpRadio);

    const reuseExistingRadio = await screen.findByLabelText(
      /creation:pci_instance_creation_network_add_public_connectivity.floating_ip_reuse_existing_label/i,
    );

    await userEvent.click(reuseExistingRadio);

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

    const floatingIpRadio = await screen.findByLabelText(
      /creation:pci_instance_creation_network_add_public_connectivity.floating_ip_label/i,
    );

    await userEvent.click(floatingIpRadio);

    await waitFor(() => {
      expect(
        screen.getByLabelText(
          /creation:pci_instance_creation_network_add_public_connectivity.floating_ip_create_new_label/i,
        ),
      ).toBeChecked();

      expect(
        screen.getByText(
          /creation:pci_instance_creation_network_add_public_connectivity.floating_ip_warning/i,
        ),
      ).toBeVisible();
    });
  });
});
