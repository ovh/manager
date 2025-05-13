import '@testing-library/jest-dom';
import { describe, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { NewPrivateNetworkWrapper } from '@/__tests__/wrapper';
import useExistingGatewayRegion from '@/hooks/useExistingGatewayRegion/useExistingGatewayRegion';
import { useSmallestGatewayByRegion } from '@/hooks/useAvailableGateway/useAvailableGateway';
import GatewayCreation from './GatewayCreation.component';
import { TGateway, TGatewayCatalog } from '@/types/gateway.type';

vi.mock('@/hooks/useGuideLink/useGuideLink', () => ({
  default: () => ({
    PRIVATE_NETWORK_WITH_GATEWAY: '',
    REGION_AVAILABILITY: '',
  }),
}));
vi.mock('@/data/hooks/gateway/useGateway');
vi.mock('@/hooks/useAvailableGateway/useAvailableGateway');
vi.mocked(useSmallestGatewayByRegion).mockReturnValue({
  data: {
    size: 's',
    price: 0,
  },
  isLoading: false,
} as UseQueryResult<TGatewayCatalog>);
vi.mock('@/hooks/useExistingGatewayRegion/useExistingGatewayRegion');

vi.mock('@/hooks/usePrepareGatewayCreation/usePrepareGatewayCreation');

describe('GatewayCreation', () => {
  it('should disabled the assign gateway checkbox when region is not yet selected', () => {
    vi.mocked(useExistingGatewayRegion).mockReturnValue({
      gateway: undefined,
      isLoading: false,
    });

    render(<GatewayCreation />, {
      wrapper: NewPrivateNetworkWrapper,
    });

    expect(screen.getByTestId('create-public-gateway')).toBeDisabled();
  });

  it('should display gateway catalog when user check assign a gateway and there is not yet an existing gateway for the region', async () => {
    vi.mocked(useExistingGatewayRegion).mockReturnValue({
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
    vi.mocked(useExistingGatewayRegion).mockReturnValue({
      gateway: {
        id: 'gatewayid2',
        name: 'gateway2',
        region: 'GRA11',
        externalInformation: {
          ips: [{ ip: 'ip1', subnetId: 'subnetId' }],
          networkId: 'net1',
        },
      } as TGateway,
      isLoading: false,
    });

    render(<GatewayCreation />, {
      wrapper: NewPrivateNetworkWrapper,
    });

    fireEvent.click(screen.getByTestId('create-public-gateway'));

    await waitFor(() =>
      expect(
        screen.getByText(
          'pci_projects_project_network_private_create_summary_step_gateway_available',
        ),
      ).toBeInTheDocument(),
    );
  });

  it('should display snat checkbox when gateway exist and has not externalInformation', async () => {
    vi.mocked(useExistingGatewayRegion).mockReturnValue({
      gateway: {
        id: 'gatewayid2',
        name: 'gateway2',
        region: 'GRA11',
      } as TGateway,
      isLoading: false,
    });

    render(<GatewayCreation />, {
      wrapper: NewPrivateNetworkWrapper,
    });

    fireEvent.click(screen.getByTestId('create-public-gateway'));

    await waitFor(() =>
      expect(
        screen.getByText(
          'pci_projects_project_network_private_create_summary_step_gateway_enable_snat',
        ),
      ).toBeInTheDocument(),
    );
  });
});
