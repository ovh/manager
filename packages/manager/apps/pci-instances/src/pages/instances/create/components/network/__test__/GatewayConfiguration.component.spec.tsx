import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import GatewayConfiguration from '../GatewayConfiguration.component';
import { renderWithMockedWrappers } from '@/__tests__/wrapperRenders';
import {
  mockedNetworkCatalog,
  mockedPrivateNetworks,
} from '@/__mocks__/instance/constants';
import { TestCreateInstanceFormWrapper } from '@/__tests__/CreateInstanceFormWrapper';
import { TPrivateNetworkData } from '../../../view-models/networksViewModel';
import { getNetworkCatalog } from '@/data/api/networkCatalog';
import { useInstancesCatalogWithSelect } from '@/data/hooks/catalog/useInstancesCatalogWithSelect';
import { TDeploymentModeID } from '@/domain/entities/instancesCatalog';

const getNetworkCatalogMock = vi.fn();
const useInstancesCatalogWithSelectMock = vi.fn();

vi.mock('@/data/api/networkCatalog');
vi.mocked(getNetworkCatalog).mockImplementation(getNetworkCatalogMock);

vi.mock('@/data/hooks/catalog/useInstancesCatalogWithSelect');
vi.mocked(useInstancesCatalogWithSelect).mockImplementation(
  useInstancesCatalogWithSelectMock,
);

type TSetupTestProps = {
  subnetId?: string | null;
  microRegion?: string | null;
  willGatewayBeAttached?: boolean;
  privateNetworks?: TPrivateNetworkData[];
  deploymentMode?: TDeploymentModeID;
};

const setupTest = ({
  subnetId = null,
  microRegion = 'fake-region',
  willGatewayBeAttached = false,
  privateNetworks = [],
  deploymentMode = 'region',
}: TSetupTestProps = {}) => {
  getNetworkCatalogMock.mockReturnValue(mockedNetworkCatalog);
  useInstancesCatalogWithSelectMock.mockReturnValue({
    data: deploymentMode,
  });

  const wrapper = renderWithMockedWrappers(
    <TestCreateInstanceFormWrapper
      defaultValues={{
        subnetId,
        microRegion,
        willGatewayBeAttached,
        ipPublicType: null,
        floatingIpAssignment: null,
        existingFloatingIpId: null,
      }}
    >
      <GatewayConfiguration privateNetworks={privateNetworks} />
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
        screen.getByLabelText(
          /creation:pci_instance_creation_network_gateway_toggle_label/i,
        ),
      ).not.toBeChecked();
    });
  });

  it('should be disabled when region is localZone', async () => {
    setupTest({
      microRegion: 'fake-LZ',
      deploymentMode: 'localzone',
    });

    await waitFor(() => {
      expect(
        screen.getByLabelText(
          /creation:pci_instance_creation_network_gateway_toggle_label/i,
        ),
      ).toBeDisabled();
    });
  });

  it('should be disabled and checked when selected network has gateway', async () => {
    setupTest({
      subnetId: mockedPrivateNetworks[1]?.value,
      privateNetworks: mockedPrivateNetworks,
    });

    await waitFor(() => {
      const toggle = screen.getByLabelText(
        /creation:pci_instance_creation_network_gateway_toggle_label/i,
      );

      expect(toggle).toBeDisabled();
      expect(toggle).toBeChecked();
    });
  });

  it('should be enabled when assign new gateway is checked', async () => {
    setupTest({
      willGatewayBeAttached: true,
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
