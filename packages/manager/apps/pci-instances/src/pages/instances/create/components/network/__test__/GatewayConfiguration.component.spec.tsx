import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import GatewayConfiguration from '../GatewayConfiguration.component';
import { renderWithMockedWrappers } from '@/__tests__/wrapperRenders';
import {
  mockedNetworkCatalog,
  mockedPrivateNetworks,
} from '@/__mocks__/instance/constants';
import { TestCreateInstanceFormWrapper } from '@/__tests__/CreateInstanceFormWrapper';
import { TPrivateNetworkSubnetData } from '../../../view-models/networksViewModel';
import { getNetworkCatalog } from '@/data/api/networkCatalog';

const getNetworkCatalogMock = vi.fn();

vi.mock('@/data/api/networkCatalog');
vi.mocked(getNetworkCatalog).mockImplementation(getNetworkCatalogMock);

type TSetupTestProps = {
  networkId?: string | null;
  microRegion?: string | null;
  assignNewGateway?: boolean;
  subnets?: TPrivateNetworkSubnetData[];
};

const setupTest = ({
  networkId = null,
  microRegion = 'fake-region',
  assignNewGateway = false,
  subnets = [],
}: TSetupTestProps = {}) => {
  getNetworkCatalogMock.mockReturnValue(mockedNetworkCatalog);

  const wrapper = renderWithMockedWrappers(
    <TestCreateInstanceFormWrapper
      defaultValues={{
        networkId,
        microRegion,
        assignNewGateway,
        ipPublicType: null,
        floatingIpAssignment: null,
        existingFloatingIp: null,
      }}
    >
      <GatewayConfiguration subnets={subnets} />
    </TestCreateInstanceFormWrapper>,
  );
  return wrapper;
};

describe('Considering GatewayConfiguration component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display gateway configuration with toggle disabled by default', async () => {
    setupTest();

    await waitFor(() => {
      expect(
        screen.getByText(
          'creation:pci_instance_creation_network_gateway_title',
        ),
      ).toBeVisible();

      expect(
        screen.getByLabelText(
          /creation:pci_instance_creation_network_gateway_toggle_label/i,
        ),
      ).not.toBeChecked();
    });
  });

  it('should be disabled when region is localZone', async () => {
    setupTest({
      microRegion: 'fake-LZ',
    });

    await waitFor(() => {
      expect(
        screen.getByLabelText(
          /creation:pci_instance_creation_network_gateway_toggle_label/i,
        ),
      ).toBeDisabled();
    });
  });

  it('should be disabled when selected network has gateway', async () => {
    setupTest({
      networkId: mockedPrivateNetworks[1]?.value,
      subnets: mockedPrivateNetworks,
    });

    await waitFor(() => {
      const toggle = screen.getByLabelText(
        /creation:pci_instance_creation_network_gateway_toggle_label/i,
      );

      expect(toggle).toBeDisabled();
      expect(toggle).not.toBeChecked();
    });
  });

  it('should be enabled when assign new gateway is checked', async () => {
    setupTest({
      assignNewGateway: true,
    });

    await waitFor(() => {
      expect(
        screen.getByLabelText(
          /creation:pci_instance_creation_network_gateway_toggle_label/i,
        ),
      ).not.toBeDisabled();
    });
  });
});
