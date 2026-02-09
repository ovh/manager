import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Root, { Loader } from '@/pages/Root.page';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import * as serviceApi from '@/data/api/database/service.api';
import * as database from '@/types/cloud/project/database';
import { mockedUsedNavigate, setMockedUseParams } from '@/__tests__/helpers/mockRouterDomHelper';

const ServiceProps = {
  params: {
    projectId: 'projectId',
    category: 'operational',
  },
  request: new Request('https://my-api.com/endpoint'),
};

vi.mock('@/data/api/database/service.api', () => ({
  getServices: vi.fn(() => []),
}));

describe('Home page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    setMockedUseParams({
      projectId: 'projectId',
      category: database.engine.CategoryEnum.all,
    });
  });

  it('fetches services data', async () => {
    Loader(ServiceProps);
    await waitFor(() => {
      expect(serviceApi.getServices).toHaveBeenCalled();
    });
  });

  it('should display service page', async () => {
    vi.mocked(serviceApi.getServices).mockResolvedValue([mockedService]);
    render(<Root />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByTestId('services-guides-container'),
      ).toBeInTheDocument();
    });
  });
});
