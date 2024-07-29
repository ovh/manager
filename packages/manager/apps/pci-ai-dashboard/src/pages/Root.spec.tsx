import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

import Layout, { breadcrumb as Breadcrumb, Loader } from '@/pages/Root.layout';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as projectAPI from '@/data/api/project/project.api';
import * as authAPI from '@/data/api/ai/authorization.api';
import { mockedAuthorization } from '@/__tests__/helpers/mocks/authorization';
import * as ai from '@/types/cloud/project/ai';

const breadCrumbParam = {
  params: {
    projectId: 'projectId',
  },
  request: new Request('https://my-api.com/endpoint'),
};

describe('Dashboard Layout', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useParams: () => ({
          projectId: 'projectId',
        }),
      };
    });

    vi.mock('@/data/api/project/project.api', () => {
      return {
        getProject: vi.fn(() => ({
          project_id: '123456',
          projectName: 'projectName',
          description: 'description',
        })),
      };
    });
    vi.mock('@/data/api/ai/authorization.api', () => ({
      getAuthorization: vi.fn(() => mockedAuthorization),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the breadcrumb component', async () => {
    render(<Breadcrumb />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText('AI Dashboard')).toBeInTheDocument();
    });
  });

  it('renders the breadcrumb component', async () => {
    Loader(breadCrumbParam);
    await waitFor(() => {
      expect(projectAPI.getProject).toHaveBeenCalled();
    });
  });

  it('renders the Layout component', async () => {
    render(<Layout />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('pageLayout')).toBeInTheDocument();
      expect(screen.getByText('description')).toBeInTheDocument();
    });
  });

  it('renders the Layout component and display auth page', async () => {
    const noAut: ai.AuthorizationStatus = {
      authorized: false,
    };
    vi.mocked(authAPI.getAuthorization).mockResolvedValueOnce(noAut);
    render(<Layout />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('pageLayout')).toBeInTheDocument();
      expect(screen.getByText('Salut Auth Page')).toBeInTheDocument();
    });
  });
});
