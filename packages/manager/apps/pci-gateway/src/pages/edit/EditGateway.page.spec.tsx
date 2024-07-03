import { describe, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import {
  QueryClient,
  QueryClientProvider,
  UseMutationResult,
  UseQueryResult,
} from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import * as pciCommonModule from '@ovh-ux/manager-pci-common';
import { TProject } from '@ovh-ux/manager-pci-common';
import EditGatewayPage from './EditGateway.page';
import * as useGatewayModule from '@/api/hooks/useGateways';
import { TGateway } from '@/api/data/gateways';

type UseEditGatewayReturnType = UseMutationResult<
  TGateway,
  Error,
  { name: string; model: string },
  unknown
> & {
  updateGateway: () => void;
};

const mockedUseNavigate = vi.fn();
const mockGatewayUpdate = vi.fn();

vi.mock('react-router-dom', () => ({
  useHref: () => 'mocked_url',
  useSearchParams: () => [
    new URLSearchParams({
      gatewayId: 'gateway-id',
      region: 'region-gateway',
    }),
  ],
  useParams: () => ({
    gatewayId: '123',
    projectId: '123',
  }),
  useNavigate: () => mockedUseNavigate,
}));

const shellContext = {
  environment: {
    getUser: vi.fn(),
  },
  shell: {
    navigation: {
      getURL: vi.fn().mockResolvedValue('mocked_url'),
    },
    ux: {
      hidePreloader: vi.fn(),
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

describe('EditGatewayPage', () => {
  it('renders without crashing', () => {
    vi.spyOn(pciCommonModule, 'useProject').mockResolvedValue({
      data: {
        project_id: '123',
        planCode: 'project.discovery',
        description: 'description',
      },
    } as UseQueryResult<TProject, null>);
    vi.spyOn(useGatewayModule, 'useEditGateway').mockReturnValue(({
      updateGateway: mockGatewayUpdate,
      isPending: false,
    } as unknown) as UseEditGatewayReturnType);
    const { getByTestId } = render(<EditGatewayPage />, {
      wrapper,
    });
    waitFor(() => {
      expect(getByTestId('gatewayEdit-spinner')).toBeInTheDocument();
    });
  });
});
