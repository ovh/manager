import { describe, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navigate } from 'react-router-dom';
import { UseQueryResult } from '@tanstack/react-query';
import * as managerComponentModule from '@ovhcloud/manager-components';
import { PublicCloudProject } from '@ovhcloud/manager-components';
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
vi.mock('@ovhcloud/manager-components', async () => {
  const mod = await vi.importActual('@ovhcloud/manager-components');
  return {
    ...mod,
  };
});

describe('OnBoardingPage', () => {
  it('should render children when volumes are empty', () => {
    const { shell } = shellContext;
    shell.navigation.getURL.mockResolvedValue('https://www.ovh.com');
    vi.mocked(useWorkflows).mockReturnValue({
      data: [],
      isPending: false,
    } as UseQueryResult<never[]>);

    vi.spyOn(managerComponentModule, 'useProject').mockReturnValue(({
      description: 'mocked_description',
      planCode: 'project.discovery',
    } as unknown) as UseQueryResult<PublicCloudProject, never>);

    const { container, getByText } = render(<OnBoardingPage />, {
      wrapper,
    });
    expect(container).toBeDefined();
    expect(
      getByText('pci_workflow_onboarding_create_instance'),
    ).toBeInTheDocument();
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
