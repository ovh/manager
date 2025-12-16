import { vi } from 'vitest';
import '@testing-library/jest-dom';
import { NavLinkProps } from 'react-router-dom';

// Mock the ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Stub the global ResizeObserver
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

vi.mock('@ovh-ux/manager-react-shell-client', async () => {
  const original = await vi.importActual('@ovh-ux/manager-react-shell-client');
  return {
    ...original,
    useOvhTracking: () => ({ trackClick: vi.fn(), trackPage: vi.fn() }),
  };
});

vi.mock('@ovh-ux/manager-module-common-api', async () => {
  const original = await vi.importActual('@ovh-ux/manager-module-common-api');
  return {
    ...original,
    useDeleteService: vi.fn().mockReturnValue({
      terminateService: vi.fn(),
      isPending: false,
      error: false,
      isError: false,
    }),
  };
});

vi.mock('react-router-dom', async () => {
  const original = await vi.importActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => vi.fn(),
    useSearchParams: () => [{ get: (str: string) => str }],
    useLocation: vi.fn().mockReturnValue({
      pathname: 'pathname',
    }),
    useParams: () => ({ id: 'vrack_service_1', vrackId: 'vrack_0' }),
    NavLink: ({ ...params }: NavLinkProps) => params.children,
  };
});
