import { describe, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navigate, useRouteLoaderData } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
  UseQueryResult,
} from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { useAllVolumes, TVolume } from '@/api/hooks/useVolume';
import OnBoardingPage from './OnBoarding.page';

vi.mock('@/api/hooks/useVolume');
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
vi.mock('@ovh-ux/manager-pci-common', async () => {
  const mod = await vi.importActual('@ovh-ux/manager-pci-common');
  return {
    ...mod,
    useProject: vi.fn().mockResolvedValue({}),
  };
});

const shellContext = {
  environment: {
    getUser: () => ({ ovhSubsidiary: 'mocked_ovhSubsidiary' }),
  },
  shell: {
    navigation: {
      getURL: vi.fn(),
    },
  },
};

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <ShellContext.Provider
      value={(shellContext as unknown) as ShellContextType}
    >
      {children}
    </ShellContext.Provider>
  </QueryClientProvider>
);

describe('OnBoardingPage', () => {
  it('should render children when volumes are empty', () => {
    const { shell } = shellContext;
    shell.navigation.getURL.mockResolvedValue('https://www.ovh.com');
    vi.mocked(useRouteLoaderData).mockReturnValue({
      description: 'mocked_description',
      planCode: 'project.discovery',
    });
    vi.mocked(useAllVolumes).mockReturnValue({
      data: [],
      isPending: false,
    } as UseQueryResult<TVolume[]>);

    const { container, getByText } = render(<OnBoardingPage />, {
      wrapper,
    });
    expect(container).toBeDefined();
    expect(
      getByText('pci_projects_project_storages_blocks_onboarding_action_label'),
    ).toBeInTheDocument();
  });

  it('should render spinner when isLoading is true', () => {
    const { shell } = shellContext;
    shell.navigation.getURL.mockResolvedValue('https://www.ovh.com');
    vi.mocked(useAllVolumes).mockReturnValue({
      data: null,
      isPending: true,
    } as UseQueryResult<TVolume[]>);
    render(<OnBoardingPage />, { wrapper });

    expect(screen.getByTestId('redirectionGuard_spinner')).toBeInTheDocument();
    expect(vi.mocked(Navigate)).not.toHaveBeenCalled();
  });
});
