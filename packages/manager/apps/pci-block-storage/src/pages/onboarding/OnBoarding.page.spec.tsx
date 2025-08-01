import { describe, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { Navigate } from 'react-router-dom';
import { UseQueryResult } from '@tanstack/react-query';
import { TVolume, useAllVolumes } from '@/api/hooks/useVolume';
import OnBoardingPage from './OnBoarding.page';
import { renderWithMockedWrappers } from '@/__tests__/renderWithMockedWrappers';

vi.mock('@/api/hooks/useVolume');
vi.mock('react-router-dom');
vi.mock('@/core/HidePreloader', () => ({
  default: () => <div>HidePeloader</div>,
}));
vi.mock('@ovh-ux/manager-pci-common', async () => {
  const mod = await vi.importActual('@ovh-ux/manager-pci-common');
  return {
    ...mod,
    useProject: vi.fn().mockResolvedValue({}),
  };
});

describe('OnBoardingPage', () => {
  it('should render children when volumes are empty', () => {
    vi.mocked(useAllVolumes).mockReturnValue({
      data: [],
      isPending: false,
    } as UseQueryResult<TVolume[]>);

    const { getByText } = renderWithMockedWrappers(<OnBoardingPage />);
    expect(
      getByText('pci_projects_project_storages_blocks_onboarding_action_label'),
    ).toBeInTheDocument();
  });

  it('should render spinner when isLoading is true', () => {
    vi.mocked(useAllVolumes).mockReturnValue({
      data: null,
      isPending: true,
    } as UseQueryResult<TVolume[]>);
    renderWithMockedWrappers(<OnBoardingPage />);

    expect(screen.getByTestId('redirectionGuard_spinner')).toBeInTheDocument();
    expect(vi.mocked(Navigate)).not.toHaveBeenCalled();
  });
});
