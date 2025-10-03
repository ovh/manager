import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { fireEvent, render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import * as useKubernetesModule from '@/api/hooks/useKubernetes';
import { TKube } from '@/types';
import { wrapper } from '@/wrapperRenders';

import ResetKubeConfigPage from './ResetKubeConfig.page';

type UseResetKubeConfigReturnType = UseMutationResult<never, Error, void, unknown> & {
  resetKubeConfig: () => void;
};

describe('ResetKubeConfigPage', () => {
  it('renders loading spinner when data is pending', () => {
    vi.spyOn(useKubernetesModule, 'useKubernetesCluster').mockReturnValue({
      isPending: true,
    } as UseQueryResult<TKube>);
    const { getByTestId } = render(<ResetKubeConfigPage />, { wrapper });
    expect(getByTestId('resetKubeConfig-spinner')).toBeVisible();
  });

  it('renders reset kubeconfig content when data is available with cluster not ready', () => {
    vi.spyOn(useKubernetesModule, 'useKubernetesCluster').mockReturnValue({
      isPending: false,
    } as UseQueryResult<TKube>);
    const { getByText } = render(<ResetKubeConfigPage />, { wrapper });
    expect(
      getByText('pci_projects_project_kubernetes_service_reset_kubeconfig_cluster_not_ready'),
    ).toBeInTheDocument();
  });

  it('renders reset kubeconfig content when data is available with cluster ready', () => {
    vi.spyOn(useKubernetesModule, 'useKubernetesCluster').mockReturnValue({
      isPending: false,
      data: {
        isClusterReady: true,
        name: 'cluster-name',
      },
    } as UseQueryResult<TKube>);
    const { getByText } = render(<ResetKubeConfigPage />, { wrapper });
    expect(
      getByText('pci_projects_project_kubernetes_service_reset_kubeconfig_message'),
    ).toBeInTheDocument();
  });

  it('calls resetKubeConfig on confirm button click', () => {
    const mockResetKubeConfig = vi.fn();
    vi.spyOn(useKubernetesModule, 'useResetKubeConfig').mockReturnValueOnce({
      resetKubeConfig: mockResetKubeConfig,
      isPending: false,
    } as unknown as UseResetKubeConfigReturnType);
    const { getByTestId } = render(<ResetKubeConfigPage />, { wrapper });
    fireEvent.click(getByTestId('resetKubeConfig-button_submit'));
    expect(mockResetKubeConfig).toHaveBeenCalled();
  });

  it('disables confirm button when reset is pending', () => {
    vi.spyOn(useKubernetesModule, 'useKubernetesCluster').mockReturnValue({
      isPending: true,
    } as UseQueryResult<TKube>);
    const { getByTestId } = render(<ResetKubeConfigPage />, { wrapper });
    expect(getByTestId('resetKubeConfig-button_submit')).toBeDisabled();
  });
});
