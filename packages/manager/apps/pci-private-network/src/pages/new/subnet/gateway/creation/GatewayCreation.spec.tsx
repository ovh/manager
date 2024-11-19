import '@testing-library/jest-dom';
import { describe, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { NewPrivateNetworkWrapper } from '@/__tests__/wrapper';
import {
  useGatewayCatalog,
  TUseGatewayCatalog,
} from '@/data/hooks/gateway/useGateway';
import useIsPlanCodeAvailableInRegion from '@/hooks/useIsPlanCodeAvailableInRegion/useIsPlanCodeAvailableInRegion';
import useExistingGatewayRegion from '@/hooks/useExistingGatewayRegion/useExistingGatewayRegion';
import GatewayCreation from './GatewayCreation.component';
import { TGateway } from '@/types/gateway.type';

vi.mock('@/hooks/useGuideLink/useGuideLink', () => ({
  default: () => ({
    PRIVATE_NETWORK_WITH_GATEWAY: '',
    REGION_AVAILABILITY: '',
  }),
}));
vi.mock(
  '@/hooks/useIsPlanCodeAvailableInRegion/useIsPlanCodeAvailableInRegion',
);
vi.mock('@/data/hooks/gateway/useGateway');
vi.mocked(useGatewayCatalog).mockReturnValue({
  data: {
    size: 's',
    pricePerMonth: 0,
    pricePerHour: 0,
  },
  isLoading: false,
} as TUseGatewayCatalog);
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
    vi.mocked(useIsPlanCodeAvailableInRegion).mockReturnValue(true);

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
    vi.mocked(useIsPlanCodeAvailableInRegion).mockReturnValue(true);

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
    vi.mocked(useIsPlanCodeAvailableInRegion).mockReturnValue(true);

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
