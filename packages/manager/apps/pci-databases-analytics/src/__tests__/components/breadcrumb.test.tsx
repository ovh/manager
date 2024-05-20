import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { RouterWithQueryClientWrapper } from '../helpers/wrappers/RouterWithQueryClientWrapper';

vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');
  return {
    ...mod,
    useParams: () => ({
      projectId: '123456',
    }),
    useMatches: () => [
      {
        id: '1',
        pathname: 'users',
        data: {},
        handle: {
          breadcrumb: () => <span>users</span>,
        },
      },
      {
        id: '2',
        pathname: 'userName',
        data: {},
        handle: {
          breadcrumb: () => <span>userName</span>,
        },
      },
    ],
  };
});

vi.mock('@/api/projects', () => {
  return {
    getProject: vi.fn(() => ({
      project_id: '123456',
      projectName: 'projectName',
      description: 'description',
    })),
  };
});
vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useNavigation: () => ({
    getURL: vi.fn((app: string, path: string) => `#mockedurl-${app}${path}`),
  }),
}));

describe('Breadcrumb component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should display the breadcrumb component', async () => {
    render(<Breadcrumb />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText('description')).toBeInTheDocument();
      expect(screen.getByText('users')).toBeInTheDocument();
    });
  });
});
