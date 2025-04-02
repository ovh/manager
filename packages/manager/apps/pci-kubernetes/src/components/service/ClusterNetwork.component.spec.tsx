import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, Mock } from 'vitest';
import { useRegionSubnets } from '@/api/hooks/useSubnets';
import { useRegionInformations } from '@/api/hooks/useRegionInformations';
import ClusterNetwork, {
  ClusterNetworkProps,
} from './ClusterNetwork.component';
import { wrapper } from '@/wrapperRenders';

vi.mock('@/api/hooks/useSubnets', () => ({
  useRegionSubnets: vi.fn(),
}));

vi.mock('@/api/hooks/useRegionInformations', () => ({
  useRegionInformations: vi.fn(),
}));

describe('ClusterNetwork Component', () => {
  beforeEach(() => {
    vi.mocked(useRegionSubnets as Mock).mockReturnValue({
      data: [],
      isPending: false,
    });
    vi.mocked(useRegionInformations as Mock).mockReturnValue({
      data: { type: 'region' },
      isPending: false,
    });
  });

  it('renders the component with public network', () => {
    const props = {
      projectId: 'project-123',
      kubeDetail: {
        region: 'region-1',
        privateNetworkId: null,
        privateNetworkConfiguration: null,
      },
    } as ClusterNetworkProps;

    render(<ClusterNetwork {...props} />, { wrapper });

    expect(
      screen.getByText('kube_service_cluster_network_tile_title'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('kube_service_cluster_network_public'),
    ).toBeInTheDocument();
  });

  it('renders the component with private network', () => {
    const props = {
      projectId: 'project-123',
      kubeDetail: {
        region: 'region-1',
        privateNetworkId: 'network-123',
        privateNetworkConfiguration: {
          defaultVrackGateway: '192.168.1.1',
          privateNetworkRoutingAsDefault: true,
        },
        attachedTo: 'Attached Network',
      },
    } as ClusterNetworkProps;

    render(<ClusterNetwork {...props} />, { wrapper });

    expect(screen.getByText('Attached Network')).toBeInTheDocument();
    expect(
      screen.getByText('pci_kubernetes_network_data_private'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('pci_kubernetes_network_data_ip: 192.168.1.1'),
    ).toBeInTheDocument();
  });

  it('disables the edit button when kubeDetail status is processing', () => {
    vi.mocked(useRegionInformations as Mock).mockReturnValue({
      data: { type: 'region' },
      isPending: false,
    });
    const props = {
      projectId: 'project-123',
      kubeDetail: {
        region: 'BHS',
        privateNetworkId: 'network-123',
        status: 'PROCESSING',
      },
    } as ClusterNetworkProps;

    render(<ClusterNetwork {...props} />, { wrapper });

    const editButton = screen.getByTestId('cluster-network-edit-button');
    expect(editButton).toHaveAttribute('variant', 'ghost');
  });
  it('does not show the button when regions are multi-zone', () => {
    vi.mocked(useRegionInformations as Mock).mockReturnValue({
      data: { type: 'region-3-az' },
      isPending: false,
    });

    expect(screen.queryByTestId('cluster-network-edit-button')).toBeNull();
    vi.mocked(useRegionInformations as Mock).mockReturnValue({
      data: { type: 'region' },
      isPending: false,
    });
  });

  it('must show the button when regions are mono-zone', async () => {
    vi.mocked(useRegionInformations as Mock).mockReturnValue({
      data: { type: 'region' },
      isPending: false,
    });
    const props = {
      projectId: 'project-123',
      kubeDetail: {
        region: 'BHS',
        privateNetworkId: 'network-123',
        status: 'OK',
      },
    } as ClusterNetworkProps;

    render(<ClusterNetwork {...props} />, { wrapper });
    await waitFor(() =>
      expect(
        screen.getByTestId('cluster-network-edit-button'),
      ).toBeInTheDocument(),
    );
  });

  it('shows subnet information when available', () => {
    const props = {
      projectId: 'project-123',
      kubeDetail: {
        region: 'region-1',
        privateNetworkId: 'network-123',
        nodesSubnetId: 'subnet-123',
        loadBalancersSubnetId: 'subnet-456',
      },
    } as ClusterNetworkProps;

    vi.mocked(useRegionSubnets as Mock).mockReturnValue({
      data: [
        { id: 'subnet-123', cidr: '192.168.1.0/24' },
        { id: 'subnet-456', cidr: '192.168.2.0/24' },
      ],
      isPending: false,
    });

    render(<ClusterNetwork {...props} />, { wrapper });

    expect(screen.getByText('subnet-123 - 192.168.1.0/24')).toBeInTheDocument();
    expect(screen.getByText('subnet-456 - 192.168.2.0/24')).toBeInTheDocument();
  });
});
