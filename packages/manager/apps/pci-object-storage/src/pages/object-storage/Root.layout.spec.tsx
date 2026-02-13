import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Layout, {
  breadcrumb as Breadcrumb,
  Loader,
} from '@/pages/object-storage/Root.layout';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as projectAPI from '@/data/api/project/project.api';

const breadCrumbParam = {
  params: {
    projectId: 'projectId',
  },
  request: new Request('https://my-api.com/endpoint'),
};

describe('OS Layout', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.mock('@/data/api/project/project.api', () => {
      return {
        getProject: vi.fn(() => ({
          project_id: '123456',
          projectName: 'projectName',
          description: 'description',
        })),
      };
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the breadcrumb component', async () => {
    render(<Breadcrumb />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText('crumb-object-storage')).toBeInTheDocument();
    });
  });

  it('renders the breadcrumb component', async () => {
    const test = Loader(breadCrumbParam);

    await waitFor(() => {
      expect(projectAPI.getProject).toHaveBeenCalled();
    });
  });

  it('renders the Layout component', async () => {
    render(<Layout />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('pageLayout')).toBeTruthy();
    });
  });
});
