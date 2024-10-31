import '@testing-library/jest-dom';
import { describe, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { NewPrivateNetworkWrapper } from '@/utils/test/test.provider';
import GatewayCreation from './GatewayCreation.component';

const {
  catalog,
  useExistingGatewayRegion,
  useGatewayAvailabilityRegion,
} = vi.hoisted(() => ({
  useGatewayAvailabilityRegion: vi.fn(),
  useExistingGatewayRegion: vi.fn(),
  catalog: {
    size: 's',
    pricePerMonth: 0,
    pricePerHour: 0,
  },
}));

vi.mock('@/hooks/useGuideLink/useGuideLink', () => ({
  default: () => ({
    PRIVATE_NETWORK_WITH_GATEWAY: '',
    REGION_AVAILABILITY: '',
  }),
}));
vi.mock(
  '@/hooks/useGatewayAvailabilityRegion/useGatewayAvailabilityRegion',
  () => ({
    default: useGatewayAvailabilityRegion,
  }),
);
vi.mock(
  '@/hooks/useAvailableGatewayCatalog/useAvailableGatewayCatalog',
  () => ({
    default: () => ({ catalog, isLoading: false }),
  }),
);
vi.mock('@/hooks/useExistingGatewayRegion/useExistingGatewayRegion', () => ({
  default: useExistingGatewayRegion,
}));

vi.mock('@/hooks/usePrepareGatewayCreation/usePrepareGatewayCreation');

describe('GatewayCreation', () => {
  it('should disabled the assign gateway checkbox when region is not yet selected', () => {
    useExistingGatewayRegion.mockReturnValue({
      gateway: undefined,
      isLoading: false,
    });

    render(<GatewayCreation />, {
      wrapper: NewPrivateNetworkWrapper,
    });

    expect(screen.getByTestId('create-public-gateway')).toBeDisabled();
  });

  it('should display gateway catalog when user check assign a gateway and there is not yet an existing gateway for the region', async () => {
    useGatewayAvailabilityRegion.mockReturnValue(true);

    useExistingGatewayRegion.mockReturnValue({
      gateway: undefined,
      isLoading: false,
    });

    render(<GatewayCreation />, {
      wrapper: NewPrivateNetworkWrapper,
    });

    fireEvent.click(screen.getByTestId('create-public-gateway'));

    await waitFor(() =>
      expect(screen.getByTestId('gateway-catalog')).toBeInTheDocument(),
    );
  });

  it('should display existing gateway when user check assign a gateway and exist already', async () => {
    useGatewayAvailabilityRegion.mockReturnValue(true);

    useExistingGatewayRegion.mockReturnValue({
      gateway: {
        id: 'gatewayid2',
        name: 'gateway2',
        region: 'GRA11',
        externalInformation: {
          ips: [{ ip: 'ip1', subnetId: 'subnetId' }],
          networkId: 'net1',
        },
      },
      isLoading: false,
    });

    render(<GatewayCreation />, {
      wrapper: NewPrivateNetworkWrapper,
    });

    fireEvent.click(screen.getByTestId('create-public-gateway'));

    await waitFor(() =>
      expect(screen.getByTestId('gateway-gateway2')).toBeInTheDocument(),
    );
  });
});
