import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { setMockedUseParams } from '@/__tests__/helpers/mockRouterDomHelper';
import ServiceLayout, {
  breadcrumb as Breadcrumb,
  Loader,
} from '@/pages/services/[serviceId]/Service.layout';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import * as database from '@/types/cloud/project/database';
import * as serviceAPI from '@/data/api/database/service.api';

const loaderParam = {
  params: {
    projectId: 'projectId',
    serviceId: 'serviceId',
    category: database.engine.CategoryEnum.operational,
  },
  request: new Request('https://my-api.com/endpoint'),
};


vi.mock('@/data/api/database/service.api', () => ({
  getService: vi.fn(),
}));

describe('Service Layout', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    setMockedUseParams({
      projectId: 'projectId',
      serviceId: 'serviceId',
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loader function', async () => {
    const test = Loader(loaderParam);
    await waitFor(() => {
      expect(serviceAPI.getService).toHaveBeenCalled();
    });
  });

  it('renders skeleton of service Layout', async () => {
    vi.mocked(serviceAPI.getService).mockResolvedValue(mockedService);
    render(<ServiceLayout />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText('Loading your service data')).toBeInTheDocument();
    });
  });

  it('renders breadcrumb', async () => {
    vi.mocked(serviceAPI.getService).mockResolvedValue(mockedService);
    render(<Breadcrumb />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText(mockedService.description)).toBeInTheDocument();
    });
  });

  it('renders fully service layout', async () => {
    render(<ServiceLayout />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(
        screen.getByTestId('service-header-container'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('legal-mentions-container'),
      ).toBeInTheDocument();
    });
  });
});
