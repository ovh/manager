import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import GatewayConfiguration from '../GatewayConfiguration.component';
import { renderWithMockedWrappers } from '@/__tests__/wrapperRenders';
import { mockedPrivateNetworks } from '@/__mocks__/instance/constants';
import { TestCreateInstanceFormWrapper } from '@/__tests__/CreateInstanceFormWrapper';

type TSetupTestProps = {
  networkId?: string | null;
  microRegion?: string | null;
  assignNewGateway?: boolean;
};

const setupTest = ({
  networkId = null,
  microRegion = null,
  assignNewGateway = false,
}: TSetupTestProps = {}) => {
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
      <GatewayConfiguration />
    </TestCreateInstanceFormWrapper>,
  );
  return wrapper;
};

describe('Considering GatewayConfiguration component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be disabled when region is localZone', () => {
    setupTest({
      microRegion: 'fake-LZ',
    });

    expect(
      screen.getByLabelText(
        /creation:pci_instance_creation_network_gateway_toggle_label/i,
      ),
    ).toBeDisabled();
  });

  it('should be disabled when selected network has gateway', () => {
    setupTest({
      networkId: mockedPrivateNetworks[1]?.value,
      microRegion: 'fake-region',
    });

    expect(
      screen.getByLabelText(
        /creation:pci_instance_creation_network_gateway_toggle_label/i,
      ),
    ).toBeDisabled();
  });

  it('should be enabled', () => {
    setupTest({
      microRegion: 'fake-region',
    });

    expect(
      screen.getByLabelText(
        /creation:pci_instance_creation_network_gateway_toggle_label/i,
      ),
    ).not.toBeDisabled();
  });

  it('should not be checked when gateway becomes disabled', async () => {
    setupTest({
      networkId: mockedPrivateNetworks[1]?.value,
      microRegion: 'fake-region',
      assignNewGateway: true,
    });

    await waitFor(() => {
      expect(
        screen.getByLabelText(
          /creation:pci_instance_creation_network_gateway_toggle_label/i,
        ),
      ).not.toBeChecked();
    });
  });
});
