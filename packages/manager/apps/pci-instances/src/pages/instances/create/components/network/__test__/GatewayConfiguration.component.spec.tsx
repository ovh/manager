import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import GatewayConfiguration from '../GatewayConfiguration.component';
import { renderWithMockedWrappers } from '@/__tests__/wrapperRenders';
import { mockedPrivateNetworks } from '@/__mocks__/instance/constants';
import { TestCreateInstanceFormWrapper } from '@/__tests__/CreateInstanceFormWrapper';

type TSetupTestProps = {
  networkId?: string | null;
  microRegion?: string | null;
};

const setupTest = ({
  networkId = null,
  microRegion = null,
}: TSetupTestProps = {}) => {
  renderWithMockedWrappers(
    <TestCreateInstanceFormWrapper
      defaultValues={{
        networkId,
        microRegion,
      }}
    >
      <GatewayConfiguration />
    </TestCreateInstanceFormWrapper>,
  );
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
});
