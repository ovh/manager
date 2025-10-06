import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { act, fireEvent, render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import * as useKubernetesClusterModule from '@/api/hooks/useKubernetes';
import { TKube } from '@/types';
import { wrapper } from '@/wrapperRenders';

import UpdateVersionPage from './UpdateVersion.page';

vi.mock('@ovh-ux/manager-react-components', () => ({
  useNotifications: () => ({
    addError: vi.fn(),
    addSuccess: vi.fn(),
  }),
}));

type UseUpdateKubeVersionReturnType = UseMutationResult<never, Error, void, unknown> & {
  updateKubeVersion: () => void;
};

describe('UpdateVersionPage', () => {
  it('renders loading spinner when data is pending', () => {
    vi.spyOn(useKubernetesClusterModule, 'useKubernetesCluster').mockReturnValue({
      isPending: true,
    } as UseQueryResult<TKube>);
    const { getByTestId } = render(<UpdateVersionPage />, { wrapper });
    expect(getByTestId('updateVersion-spinner')).toBeVisible();
  });

  it('renders update version content when data is available', () => {
    vi.spyOn(useKubernetesClusterModule, 'useKubernetesCluster').mockReturnValue({
      isPending: false,
    } as UseQueryResult<TKube>);

    const { getAllByText, queryByTestId } = render(<UpdateVersionPage />, {
      wrapper,
    });

    expect(queryByTestId('updateVersion-spinner')).not.toBeInTheDocument();
    expect(getAllByText(/kube_service_minor_version_update_message_/i)).toHaveLength(5);
  });

  it('calls updateKubeVersion on confirm button click', () => {
    const mockUpdateKubeVersion = vi.fn();
    vi.spyOn(useKubernetesClusterModule, 'useUpdateKubeVersion').mockReturnValueOnce({
      updateKubeVersion: mockUpdateKubeVersion,
      isPending: false,
    } as unknown as UseUpdateKubeVersionReturnType);
    const { getByText } = render(<UpdateVersionPage />, { wrapper });
    act(() => {
      fireEvent.click(getByText('kube_service_update_common_confirm'));
    });
    expect(mockUpdateKubeVersion).toHaveBeenCalled();
  });

  it('disables confirm button when update is pending', () => {
    vi.spyOn(useKubernetesClusterModule, 'useKubernetesCluster').mockReturnValue({
      isPending: true,
    } as UseQueryResult<TKube>);
    const { getByTestId } = render(<UpdateVersionPage />, { wrapper });
    expect(getByTestId('updateVersion-button_submit')).toBeDisabled();
  });
});
