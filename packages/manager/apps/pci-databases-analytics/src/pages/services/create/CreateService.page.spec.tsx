import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import { setMockedUseParams } from '@/__tests__/helpers/mockRouterDomHelper';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import CreateService, {
  breadcrumb as Breadcrumb,
} from '@/pages/services/create/CreateService.page';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import {
  mockedAvailabilities,
  mockedCapabilities,
  mockedEngineCapabilities,
  mockedRegionCapabilities,
  mockedSuggestions,
} from '@/__tests__/helpers/mocks/availabilities';
import * as database from '@/types/cloud/project/database';
import { mockedCatalog } from '@/__tests__/helpers/mocks/catalog';
import { mockedPciProject } from '@/__tests__/helpers/mocks/pciProjects';
import * as ProjectAPI from '@/data/api/project/project.api';
import * as ServiceAPI from '@/data/api/database/service.api';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';
import { PlanCode } from '@/types/cloud/Project';

vi.mock('@/data/api/project/project.api', () => {
  return {
    getProject: vi.fn(() => mockedPciProject),
  };
});

vi.mock('@/data/api/database/availability.api', () => ({
  getAvailabilities: vi.fn(() => [mockedAvailabilities]),
  getSuggestions: vi.fn(() => [mockedSuggestions]),
}));

vi.mock('@/data/api/database/capabilities.api', () => ({
  getEnginesCapabilities: vi.fn(() => [mockedEngineCapabilities]),
  getRegionsCapabilities: vi.fn(() => [mockedRegionCapabilities]),
  getCapabilities: vi.fn(() => mockedCapabilities),
}));

vi.mock('@/data/api/catalog/catalog.api', () => ({
  catalogApi: {
    getCatalog: vi.fn(() => mockedCatalog),
  },
}));

vi.mock('@/data/api/database/service.api', () => ({
  addService: vi.fn((service) => service),
}));

vi.mock('@/data/api/network/network.api', () => ({
  getPrivateNetworks: vi.fn(() => []),
}));

describe('Order funnel page', () => {
  beforeEach(() => {
    vi.restoreAllMocks(); 
    mockManagerReactShellClient();
    setMockedUseParams({ 
      projectId: 'projectId',
      category: database.engine.CategoryEnum.all,
     });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the breadcrumb component', async () => {
    const translationKey = 'breadcrumb';
    render(<Breadcrumb />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(translationKey)).toBeInTheDocument();
    });
  });

  it('renders the skeleton component while loading', async () => {
    render(<CreateService />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('order-funnel-skeleton')).toBeInTheDocument();
    });
  });

  // it('order summary click link display section', async () => {
  //   const mockedOnSectionClicked = vi.fn();
  //   render(
  //     <OrderSummary
  //       order={mockedOrder}
  //       onSectionClicked={mockedOnSectionClicked}
  //     />,
  //     { wrapper: RouterWithQueryClientWrapper },
  //   );
  //   await waitFor(() => {
  //     expect(screen.getByText(mockedOrder.name)).toBeInTheDocument();
  //   });
  //   act(() => {
  //     fireEvent.click(screen.getByTestId('engine-section-button'));
  //   });
  //   await waitFor(() => {
  //     expect(mockedOnSectionClicked).toHaveBeenCalledWith('engine');
  //   });
  //   act(() => {
  //     fireEvent.click(screen.getByTestId('plan-section-button'));
  //   });
  //   await waitFor(() => {
  //     expect(mockedOnSectionClicked).toHaveBeenCalledWith('plan');
  //   });
  //   act(() => {
  //     fireEvent.click(screen.getByTestId('region-section-button'));
  //   });
  //   await waitFor(() => {
  //     expect(mockedOnSectionClicked).toHaveBeenCalledWith('region');
  //   });
  //   act(() => {
  //     fireEvent.click(screen.getByTestId('flavor-section-button'));
  //   });
  //   await waitFor(() => {
  //     expect(mockedOnSectionClicked).toHaveBeenCalledWith('flavor');
  //   });
  //   act(() => {
  //     fireEvent.click(screen.getByTestId('cluster-section-button'));
  //   });
  //   await waitFor(() => {
  //     expect(mockedOnSectionClicked).toHaveBeenCalledWith('cluster');
  //   });
  //   act(() => {
  //     fireEvent.click(screen.getByTestId('network-section-button'));
  //   });
  //   await waitFor(() => {
  //     expect(mockedOnSectionClicked).toHaveBeenCalledWith('options');
  //   });
  //   act(() => {
  //     fireEvent.click(screen.getByTestId('ips-section-button'));
  //   });
  //   await waitFor(() => {
  //     expect(mockedOnSectionClicked).toHaveBeenCalledWith('options');
  //   });
  // });

  it('renders Service with discovery banner', async () => {
    const mockedDiscoveryProject = {
      ...mockedPciProject,
      planCode: PlanCode.DISCOVERY,
    };
    vi.mocked(ProjectAPI.getProject).mockResolvedValue(mockedDiscoveryProject);
    render(<CreateService />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('discovery-container')).toBeInTheDocument();
    });
  });

  it('order Service error display toast error', async () => {
    const errorMsg = {
      description: 'api error message',
      title: 'errorCreatingService',
      variant: 'critical',
    };
    vi.mocked(ServiceAPI.addService).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    render(<CreateService />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.queryByTestId('discovery-container'),
      ).not.toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('order-submit-button'));
    });
    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(errorMsg);
    });
  });

  it('order Service call Add Service and success toast', async () => {
    const successMsg = {
      title: 'successCreatingService',
    };
    render(<CreateService />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.queryByTestId('discovery-container'),
      ).not.toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('order-submit-button'));
    });
    await waitFor(() => {
      expect(ServiceAPI.addService).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith(successMsg);
    });
  });
});
