import { render, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { TProject } from '@ovh-ux/manager-pci-common';
import { UseQueryResult } from '@tanstack/react-query';
import * as ManagerPciCommonModule from '@ovh-ux/manager-pci-common';
import OnBoardingPage from '@/pages/onboarding/Onboarding.page';
import { wrapper } from '@/wrapperRenders';
import * as ApiRegistryModule from '@/api/hooks/useRegistry';
import { TRegistry } from '@/api/data/registry';

describe('OnBoardingPage', () => {
  it('renders loading spinner while fetching registries', async () => {
    vi.spyOn(ApiRegistryModule, 'useGetAllRegistries').mockReturnValueOnce({
      data: null,
      isPending: true,
    } as UseQueryResult<TRegistry[]>);
    const { getByTestId } = render(<OnBoardingPage />, { wrapper });
    expect(getByTestId('redirectionGuard_spinner')).toBeInTheDocument();
  });

  it('renders onboarding content when no registries are available', async () => {
    const mockProject = { description: 'Project 1' };
    vi.spyOn(ManagerPciCommonModule, 'useProject').mockReturnValueOnce({
      data: mockProject,
    } as UseQueryResult<TProject, never>);
    vi.spyOn(ApiRegistryModule, 'useGetAllRegistries').mockReturnValueOnce({
      data: [],
      isPending: false,
    } as UseQueryResult<TRegistry[]>);
    const { getByText } = render(<OnBoardingPage />, { wrapper });
    await waitFor(() =>
      expect(
        getByText('private_registry_onboarding_content1'),
      ).toBeInTheDocument(),
    );
    expect(
      getByText('private_registry_onboarding_content2'),
    ).toBeInTheDocument();
    expect(
      getByText('private_registry_onboarding_content3'),
    ).toBeInTheDocument();
  });
});
