import { UseQueryResult } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TCloudSchema } from '@/api/data/cloud';
import { TNetworkRegion } from '@/api/data/network';
import { TGateway } from '@/api/data/subnets';
import { useGetCloudSchema } from '@/api/hooks/useCloud';
import { useKubernetesCluster, useResetCluster } from '@/api/hooks/useKubernetes';
import { useAvailablePrivateNetworks, useListGateways } from '@/api/hooks/useNetwork';
import { useRegionInformations } from '@/api/hooks/useRegionInformations';
import { DeploymentMode, TKube } from '@/types';
import { TRegionInformations } from '@/types/region';
import { wrapper } from '@/wrapperRenders';

import ResetClusterPage from './ResetCluster.page';

vi.mock('@/api/hooks/useKubernetes', () => ({
  useKubernetesCluster: vi.fn(),
  useResetCluster: vi.fn(),
}));

vi.mock('@/api/hooks/useCloud', () => ({
  useGetCloudSchema: vi.fn(),
}));

vi.mock('@/api/hooks/useRegionInformations', () => ({
  useRegionInformations: vi.fn(),
}));

vi.mock('@/api/hooks/useNetwork', () => ({
  useAvailablePrivateNetworks: vi.fn(),
  useListGateways: vi.fn(),
}));

describe('ResetClusterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useKubernetesCluster).mockReturnValue({
      data: {
        version: '1.24',
        region: 'GRA',
      },
      isPending: false,
    } as UseQueryResult<TKube, Error>);

    vi.mocked(useGetCloudSchema).mockReturnValue({
      data: {
        models: {
          'cloud.kube.VersionEnum': { enum: ['1.24', '1.25'] },
        },
      },
      isPending: false,
    } as UseQueryResult<TCloudSchema, Error>);

    vi.mocked(useRegionInformations).mockReturnValue({
      data: {
        type: DeploymentMode.MONO_ZONE,
      },
      isPending: false,
    } as UseQueryResult<TRegionInformations, Error>);

    vi.mocked(useAvailablePrivateNetworks).mockReturnValue({
      data: [{ id: 'net-1', name: 'My Net' }] as TNetworkRegion[],
      isPending: false,
    } as UseQueryResult<TNetworkRegion[], Error>);

    vi.mocked(useListGateways).mockReturnValue({
      data: [],
      isLoading: false,
    } as UseQueryResult<TGateway[], Error>);

    vi.mocked(useResetCluster).mockReturnValue({
      resetCluster: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useResetCluster>);
  });

  it('should render reset modal with correct labels', async () => {
    render(<ResetClusterPage />, { wrapper });

    await waitFor(() => {
      expect(
        screen.getByText('reset:pci_projects_project_kubernetes_service_reset_message'),
      ).toBeInTheDocument();
    });
  });

  it('should show loading spinner when pending', () => {
    vi.mocked(useKubernetesCluster).mockReturnValueOnce({
      isPending: true,
    } as UseQueryResult<TKube, Error>);
    render(<ResetClusterPage />, { wrapper });

    expect(screen.getByTestId('resetCluster-spinner')).toBeInTheDocument();
  });
});
