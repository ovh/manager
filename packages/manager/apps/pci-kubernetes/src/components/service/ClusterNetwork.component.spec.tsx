import { UseQueryResult } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { Mock, describe, expect, it, vi } from 'vitest';

import { TPrivateNetworkSubnet } from '@/api/data/subnets';
import { useRegionInformations } from '@/api/hooks/useRegionInformations';
import { useRegionSubnets } from '@/api/hooks/useSubnets';
import { PROCESSING_STATUS } from '@/constants';
import { TRegionInformations } from '@/types/region';
import { wrapper } from '@/wrapperRenders';

import ClusterNetwork, { ClusterNetworkProps } from './ClusterNetwork.component';

vi.mock('@/api/hooks/useSubnets', () => ({
  useRegionSubnets: vi.fn(),
}));

vi.mock('@/api/hooks/useRegionInformations', () => ({
  useRegionInformations: vi.fn(),
}));

describe('ClusterNetwork Component', () => {
  const initialProps = {
    projectId: 'project-123',
    kubeDetail: {
      region: 'region-1',
      privateNetworkId: 'network-123',
      nodesSubnetId: 'subnet-123',
      loadBalancersSubnetId: 'subnet-456',
    },
  } as ClusterNetworkProps;

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

    expect(screen.getByText('kube_service_cluster_network_tile_title')).toBeInTheDocument();
    expect(screen.getByText('kube_service_cluster_network_public')).toBeInTheDocument();
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
    expect(screen.getByText('pci_kubernetes_network_data_private')).toBeInTheDocument();
    expect(screen.getByText('pci_kubernetes_network_data_ip: 192.168.1.1')).toBeInTheDocument();
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
      expect(screen.getByTestId('cluster-network-edit-button')).toBeInTheDocument(),
    );
  });
  it.each(PROCESSING_STATUS)('must disable the button when the status is not %s', (status) => {
    const props = {
      ...initialProps,
      kubeDetail: {
        ...initialProps.kubeDetail,
        status,
      },
    };
    render(<ClusterNetwork {...props} />, { wrapper });
    expect(screen.getByTestId('cluster-network-edit-button')).toHaveAttribute('disabled');
  });

  it('shows subnet information when available in Az and 3az', () => {
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

  it.each([
    {
      regionType: 'region',
      privateNetworkId: 'network-region',
      nodesSubnetId: 'subnet-region-123',
    },
    {
      regionType: 'region-3-az',
      privateNetworkId: 'network-3az',
      nodesSubnetId: 'subnet-3az-123',
    },
  ])(
    'shows subnet information when available in $regionType',
    ({ regionType, privateNetworkId, nodesSubnetId }) => {
      const props = {
        projectId: 'project-123',
        kubeDetail: {
          region: 'region-1',
          privateNetworkId,
          nodesSubnetId,
          loadBalancersSubnetId: 'subnet-456',
        },
      } as ClusterNetworkProps;
      vi.mocked(useRegionInformations).mockReturnValue({
        data: { type: regionType },
        isPending: false,
      } as UseQueryResult<TRegionInformations>);
      vi.mocked(useRegionSubnets).mockReturnValue({
        data: [
          { id: nodesSubnetId, cidr: '192.168.1.0/24' },
          { id: 'subnet-456', cidr: '192.168.2.0/24' },
        ],
        isPending: false,
      } as UseQueryResult<TPrivateNetworkSubnet[]>);
      render(<ClusterNetwork {...props} />, { wrapper });

      expect(screen.getByText(`${nodesSubnetId} - 192.168.1.0/24`)).toBeInTheDocument();
      expect(screen.getByText('subnet-456 - 192.168.2.0/24')).toBeInTheDocument();
    },
  );
});
