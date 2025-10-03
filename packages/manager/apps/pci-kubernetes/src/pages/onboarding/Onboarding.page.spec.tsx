import { UseQueryResult } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import * as useAvailableRegionsModule from '@/api/hooks/useAvailableRegions';
import * as useKubernetesModule from '@/api/hooks/useKubernetes';
import OnBoardingPage from '@/pages/onboarding/Onboarding.page';
import { TKube } from '@/types';
import { wrapper } from '@/wrapperRenders';

vi.mock('@/core/HidePreloader', () => ({
  default: () => <div>HidePeloader</div>,
}));

describe('Onboarding', () => {
  it('should render children when clusters list or available regions are empty', () => {
    vi.spyOn(useAvailableRegionsModule, 'useAvailableRegions').mockReturnValue({
      isPending: false,
    } as UseQueryResult<{ name: string; type: string }[]>);
    vi.spyOn(useKubernetesModule, 'useAllKube').mockReturnValue({
      isPending: false,
    } as UseQueryResult<TKube[]>);

    const { getByText, container } = render(<OnBoardingPage />, { wrapper });
    expect(container).toBeDefined();
    expect(getByText('pci_projects_project_kubernetes_title')).toBeVisible();
  });

  it('displays warning message when regions are unavailable', () => {
    vi.spyOn(useAvailableRegionsModule, 'useAvailableRegions').mockReturnValue({
      data: [],
      isPending: false,
    } as UseQueryResult<{ name: string; type: string }[]>);
    const { getByText } = render(<OnBoardingPage />, { wrapper });
    expect(
      getByText('pci_projects_project_kubernetes_onboarding_regions_unavailable'),
    ).toBeVisible();
  });

  it('does not display warning message when regions are available', () => {
    vi.spyOn(useAvailableRegionsModule, 'useAvailableRegions').mockReturnValue({
      data: [{ name: 'region', type: 'region' }],
      isPending: false,
    } as UseQueryResult<{ name: string; type: string }[]>);
    const { queryByText } = render(<OnBoardingPage />, { wrapper });
    expect(queryByText(/regions unavailable/i)).not.toBeInTheDocument();
  });

  it('displays loading state when clusters or regions are pending', () => {
    vi.spyOn(useAvailableRegionsModule, 'useAvailableRegions').mockReturnValue({
      data: [],
      isPending: true,
    } as UseQueryResult<{ name: string; type: string }[]>);
    vi.spyOn(useKubernetesModule, 'useAllKube').mockReturnValue({
      data: [],
      isPending: true,
    } as UseQueryResult<TKube[]>);
    const { getByTestId } = render(<OnBoardingPage />, { wrapper });
    expect(getByTestId('redirectionGuard_spinner')).toBeVisible();
  });
});
