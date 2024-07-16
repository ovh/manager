import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

import Layout, { breadcrumb as Breadcrumb, Loader } from '@/pages/Root.layout';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { database } from '@/interfaces/database';
import * as projectAPI from '@/data/api/projects';

const breadCrumbParam = {
  params: {
    projectId: 'projectId',
    category: database.CategoryEnum.operational,
  },
  request: new Request('https://my-api.com/endpoint'),
};

describe('Services Layout', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.mock('@/data/api/projects', () => {
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
    render(<Breadcrumb data={''} params={breadCrumbParam.params} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText('crumb-operational')).toBeInTheDocument();
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
      expect(screen.getByTestId('pageLayout')).toBeInTheDocument();
    });
  });
});
