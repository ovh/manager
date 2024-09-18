import { describe, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navigate } from 'react-router-dom';
import { UseQueryResult } from '@tanstack/react-query';
import * as pciCommonModule from '@ovh-ux/manager-pci-common';
import { TProject } from '@ovh-ux/manager-pci-common';
import * as useInstancesModule from '@/api/hooks/useInstances';
import OnBoardingPage from './OnBoarding.page';
import { shellContext, wrapper } from '@/wrapperRenders';
import { useWorkflows } from '@/api/hooks/workflows';

vi.mock('@/api/hooks/workflows');
vi.mock('react-router-dom', () => ({
  Navigate: vi.fn(() => null),
  useParams: () => ({ projectId: 'mocked_projectId' }),
  useNavigate: () => vi.fn(),
  useRouteLoaderData: vi.fn(),
  Outlet: vi.fn(() => 'Test Child'),
}));
vi.mock('@/core/HidePreloader', () => ({
  default: () => <div>HidePeloader</div>,
}));

describe('OnBoardingPage', () => {
  it('should render children with create button instance when workflow are empty', () => {
    const { shell } = shellContext;
    shell.navigation.getURL.mockResolvedValue('https://www.ovh.com');
    vi.mocked(useWorkflows).mockReturnValue({
      data: [],
      isPending: false,
    } as UseQueryResult<never[]>);
    vi.spyOn(useInstancesModule, 'useAllInstances').mockReturnValue({
      data: [],
      isPending: false,
    } as { data: never[]; isPending: boolean; error: never });

    vi.spyOn(pciCommonModule, 'useProject').mockReturnValue(({
      description: 'mocked_description',
      planCode: 'project.discovery',
    } as unknown) as UseQueryResult<TProject, never>);

    const { container, getByText } = render(<OnBoardingPage />, {
      wrapper,
    });
    expect(container).toBeDefined();
    expect(
      getByText('pci_workflow_onboarding_create_instance'),
    ).toBeInTheDocument();
    expect(
      getByText('pci_workflow_onboarding_no_instance'),
    ).toBeInTheDocument();
  });

  it('should render children with create button workflow when workflow are empty', () => {
    const { shell } = shellContext;
    shell.navigation.getURL.mockResolvedValue('https://www.ovh.com');
    vi.mocked(useWorkflows).mockReturnValue({
      data: [],
      isPending: false,
    } as UseQueryResult<never[]>);
    vi.spyOn(useInstancesModule, 'useAllInstances').mockReturnValue({
      data: [
        {
          id: 'mocked_instanceId',
          name: 'mocked_instanceName',
        },
      ],
      isPending: false,
    } as { data: never[]; isPending: boolean; error: never });

    vi.spyOn(pciCommonModule, 'useProject').mockReturnValue(({
      description: 'mocked_description',
      planCode: 'project.discovery',
    } as unknown) as UseQueryResult<TProject, never>);

    const { container, getByText, queryByText } = render(<OnBoardingPage />, {
      wrapper,
    });
    expect(container).toBeDefined();
    expect(getByText('pci_workflow_add')).toBeInTheDocument();
    expect(
      queryByText('pci_workflow_onboarding_no_instance'),
    ).not.toBeInTheDocument();
  });

  it('should render spinner when isLoading is true', () => {
    const { shell } = shellContext;
    shell.navigation.getURL.mockResolvedValue('https://www.ovh.com');
    vi.mocked(useWorkflows).mockReturnValue({
      data: null,
      isPending: true,
    } as UseQueryResult<never[]>);
    render(<OnBoardingPage />, { wrapper });

    expect(screen.getByTestId('redirectionGuard_spinner')).toBeInTheDocument();
    expect(vi.mocked(Navigate)).not.toHaveBeenCalled();
  });
});
