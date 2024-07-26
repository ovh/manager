import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

import Service, {
  breadcrumb as Breadcrumb,
} from '@/pages/services/create/Create.page';

import OrderSummary from '@/pages/services/create/_components/OrderSummary.component';

import { Locale } from '@/hooks/useLocale';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import {
  mockedAvailabilities,
  mockedCapabilities,
  mockedEngineCapabilities,
  mockedRegionCapabilities,
  mockedSuggestions,
} from '@/__tests__/helpers/mocks/availabilities';

import { mockedUser } from '@/__tests__/helpers/mocks/user';
import * as database from '@/types/cloud/project/database';
import { mockedCatalog } from '@/__tests__/helpers/mocks/catalog';
import {
  mockedBasicOrderFunnelFlavor,
  mockedBasicOrderFunnelPlan,
  mockedEngineVersion,
  mockedOrderFunnelEngine,
  mockedOrderFunnelRegion,
} from '@/__tests__/helpers/mocks/order-funnel';
import {
  NetworkRegionStatusEnum,
  NetworkStatusEnum,
  NetworkTypeEnum,
} from '@/types/cloud/network';
import { mockedPciProject } from '@/__tests__/helpers/mocks/pciProjects';
import * as ProjectAPI from '@/data/api/project/project.api';
import * as ServiceAPI from '@/data/api/database/service.api';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';
import { useToast } from '@/components/ui/use-toast';
import { PlanCode } from '@/types/cloud/Project';

const mockedOrder = {
  engine: mockedOrderFunnelEngine,
  version: mockedEngineVersion,
  plan: mockedBasicOrderFunnelPlan,
  region: mockedOrderFunnelRegion,
  flavor: mockedBasicOrderFunnelFlavor,
  nodes: 3,
  additionalStorage: 10,
  name: 'myNewPG',
  ipRestrictions: [
    {
      ip: 'ips',
      description: 'IpDescription',
    },
  ],
  network: {
    type: database.NetworkTypeEnum.private,
    network: {
      id: 'id1',
      name: 'network1',
      regions: [
        {
          region: 'GRA',
          openstackId: '123456',
          status: NetworkRegionStatusEnum.ACTIVE,
        },
      ],
      vlanId: 0,
      status: NetworkStatusEnum.ACTIVE,
      type: NetworkTypeEnum.private,
    },
  },
};

describe('Order funnel page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
      Trans: ({ children }: { children: React.ReactNode }) => children,
    }));
    vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
      const mod = await importOriginal<
        typeof import('@ovh-ux/manager-react-shell-client')
      >();
      return {
        ...mod,
        useShell: vi.fn(() => ({
          i18n: {
            getLocale: vi.fn(() => Locale.fr_FR),
            onLocaleChange: vi.fn(),
            setLocale: vi.fn(),
          },
          environment: {
            getEnvironment: vi.fn(() => ({
              getUser: vi.fn(() => mockedUser),
            })),
          },
        })),
      };
    });

    const ResizeObserverMock = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useParams: () => ({
          projectId: 'projectId',
          category: database.engine.CategoryEnum.all,
        }),
      };
    });

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

    vi.mock('@/components/ui/use-toast', () => {
      const toastMock = vi.fn();
      return {
        useToast: vi.fn(() => ({
          toast: toastMock,
        })),
      };
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
    render(<Service />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('order-funnel-skeleton')).toBeInTheDocument();
    });
  });

  it('order summary click link display section', async () => {
    const mockedOnSectionClicked = vi.fn();
    render(
      <OrderSummary
        order={mockedOrder}
        onSectionClicked={mockedOnSectionClicked}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await waitFor(() => {
      expect(screen.getByText(mockedOrder.name)).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('engine-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('engine');
    });
    act(() => {
      fireEvent.click(screen.getByTestId('plan-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('plan');
    });
    act(() => {
      fireEvent.click(screen.getByTestId('region-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('region');
    });
    act(() => {
      fireEvent.click(screen.getByTestId('flavor-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('flavor');
    });
    act(() => {
      fireEvent.click(screen.getByTestId('cluster-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('cluster');
    });
    act(() => {
      fireEvent.click(screen.getByTestId('network-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('options');
    });
    act(() => {
      fireEvent.click(screen.getByTestId('ips-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('options');
    });
  });

  it('renders Service with discovery banner', async () => {
    const mockedDiscoveryProject = {
      ...mockedPciProject,
      planCode: PlanCode.DISCOVERY,
    };
    vi.mocked(ProjectAPI.getProject).mockResolvedValue(mockedDiscoveryProject);
    render(<Service />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('discovery-container')).toBeInTheDocument();
    });
  });

  it('order Service error display toast error', async () => {
    const errorMsg = {
      description: 'api error message',
      title: 'errorCreatingService',
      variant: 'destructive',
    };
    vi.mocked(ServiceAPI.addService).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    render(<Service />, { wrapper: RouterWithQueryClientWrapper });
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
    render(<Service />, { wrapper: RouterWithQueryClientWrapper });
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
