import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { act, fireEvent, render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import * as useKubernetesModule from '@/api/hooks/useKubernetes';
import { UPGRADE_POLICIES } from '@/constants';
import { TKube } from '@/types';
import { wrapper } from '@/wrapperRenders';

import UpgradePolicyPage from './UpgradePolicy.page';

type UseUpdateKubePolicyReturnType = UseMutationResult<never, Error, void, unknown> & {
  updateKubePolicy: () => void;
};

describe('UpgradePolicyPage', () => {
  it('renders loading spinner when data is pending', () => {
    vi.spyOn(useKubernetesModule, 'useKubernetesCluster').mockReturnValueOnce({
      isPending: true,
    } as UseQueryResult<TKube>);
    const { getByTestId } = render(<UpgradePolicyPage />, { wrapper });
    expect(getByTestId('updatePolicy-spinner')).toBeVisible();
  });

  it('renders radio buttons with policies', () => {
    vi.spyOn(useKubernetesModule, 'useKubernetesCluster').mockReturnValueOnce({
      isPending: false,
    } as UseQueryResult<TKube>);
    const { getByText } = render(<UpgradePolicyPage />, { wrapper });
    UPGRADE_POLICIES.forEach((policy) => {
      expect(getByText(`kube_service_upgrade_policy_${policy}`)).toBeInTheDocument();
    });
  });

  it('calls updateKubePolicy on confirm button click', () => {
    vi.spyOn(useKubernetesModule, 'useKubernetesCluster').mockReturnValueOnce({
      isPending: false,
    } as UseQueryResult<TKube>);
    const mockUpdateKubePolicy = vi.fn();
    vi.spyOn(useKubernetesModule, 'useUpdateKubePolicy').mockReturnValueOnce({
      updateKubePolicy: mockUpdateKubePolicy,
      isPending: false,
    } as unknown as UseUpdateKubePolicyReturnType);
    const { getByTestId } = render(<UpgradePolicyPage />, {
      wrapper,
    });
    act(() => {
      fireEvent.click(getByTestId('upgradePolicy-button_submit'));
    });
    expect(mockUpdateKubePolicy).toHaveBeenCalled();
  });

  it('disables confirm button when update is pending', () => {
    vi.spyOn(useKubernetesModule, 'useKubernetesCluster').mockReturnValueOnce({
      isPending: true,
    } as UseQueryResult<TKube>);
    const { getByText } = render(<UpgradePolicyPage />, { wrapper });
    expect(getByText('kube_service_common_confirm')).toBeDisabled();
  });
});
