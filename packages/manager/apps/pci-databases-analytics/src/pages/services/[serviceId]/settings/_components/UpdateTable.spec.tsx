import { ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import * as ServiceContext from '@/pages/services/[serviceId]/Service.context';
import Settings from '@/pages/services/[serviceId]/settings/Settings.page';
import * as database from '@/types/cloud/project/database';
import * as nodesApi from '@/data/api/database/node.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService as mockedServiceOrig } from '@/__tests__/helpers/mocks/services';
import { mockedCatalog } from '@/__tests__/helpers/mocks/catalog';
import {
  mockedAvailabilities,
  mockedAvailabilitiesUpdate,
  mockedCapabilities,
  mockedEngineCapabilities,
  mockedRegionCapabilities,
} from '@/__tests__/helpers/mocks/availabilities';
import { mockedMaintenance } from '@/__tests__/helpers/mocks/maintenances';
import { mockedUser } from '@/__tests__/helpers/mocks/user';
import { Locale } from '@/hooks/useLocale';

// Override mock to add capabilities
const mockedService = {
  ...mockedServiceOrig,
  capabilities: {
    advancedConfiguration: {
      create: database.service.capability.StateEnum.enabled,
      update: database.service.capability.StateEnum.enabled,
      delete: database.service.capability.StateEnum.enabled,
      read: database.service.capability.StateEnum.enabled,
    },
    maintenanceApply: {
      create: database.service.capability.StateEnum.enabled,
    },
    service: {
      update: database.service.capability.StateEnum.enabled,
    },
    nodes: {
      delete: database.service.capability.StateEnum.enabled,
      create: database.service.capability.StateEnum.enabled,
    },
  },
};

const mockAdvancedConfiguration = { capability: 'capabilityMocked' };

const mockCapabilities: database.capabilities.advancedConfiguration.Property[] = [
  {
    name: 'capability',
    type: database.capabilities.advancedConfiguration.property.TypeEnum.string,
    description: 'capabilityMocked',
  },
];

describe('Update table in settings page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));

    vi.mock('@/data/api/catalog/catalog.api', () => ({
      catalogApi: {
        getCatalog: vi.fn(() => mockedCatalog),
      },
    }));

    vi.mock('@/data/api/database/availability.api', () => ({
      getAvailabilities: vi.fn(() => [
        mockedAvailabilities,
        mockedAvailabilitiesUpdate,
      ]),
    }));
    vi.mock('@/data/api/database/capabilities.api', () => ({
      getCapabilities: vi.fn(() => mockedCapabilities),
      getEnginesCapabilities: vi.fn(() => [mockedEngineCapabilities]),
      getRegionsCapabilities: vi.fn(() => [mockedRegionCapabilities]),
    }));

    vi.mock('@/data/api/database/maintenance.api', () => ({
      getMaintenances: vi.fn(() => [mockedMaintenance]),
      applyMaintenance: vi.fn((maintenance) => maintenance),
    }));

    vi.mock('@/data/api/database/advancedConfiguration.api', () => ({
      getAdvancedConfiguration: vi.fn(() => mockAdvancedConfiguration),
      getAdvancedConfigurationCapabilities: vi.fn(() => mockCapabilities),
    }));

    vi.mock('@/data/api/database/service.api', () => ({
      editService: vi.fn((service) => service),
    }));

    vi.mock('@/data/api/database/node.api', () => ({
      addNode: vi.fn((node) => node),
      deleteNode: vi.fn(),
    }));

    vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
      useServiceData: vi.fn(() => ({
        projectId: 'projectId',
        service: mockedService,
        category: 'operational',
        serviceQuery: {} as UseQueryResult<database.Service, Error>,
      })),
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

    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
      Trans: ({ children }: { children: ReactNode }) => children,
    }));
  });

  it('renders and shows skeletons while loading', async () => {
    render(<Settings />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByTestId('advanced-config-accordion-trigger'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('maintenance-settings-skeleton'),
      ).toBeInTheDocument();
    });
  });

  it('renders and shows update table with button', async () => {
    render(<Settings />, { wrapper: RouterWithQueryClientWrapper });
    const updateVersionButton = screen.getByTestId(
      'update-button-tableVersion',
    );
    const updatePlanButton = screen.getByTestId('update-button-tablePlan');
    const updateFlavorButton = screen.getByTestId('update-button-tableFlavor');
    const updateStorageButton = screen.getByTestId(
      'update-button-tableStorage',
    );
    const createNodeButton = screen.getByTestId('create-node-button');
    const deleteNodeButton = screen.getByTestId('delete-node-button');
    await waitFor(() => {
      expect(screen.getByText(mockedServiceOrig.plan)).toBeInTheDocument();
      expect(updateVersionButton).toBeInTheDocument();
      expect(updatePlanButton).toBeInTheDocument();
      expect(updateFlavorButton).toBeInTheDocument();
      expect(updateStorageButton).toBeInTheDocument();
      expect(createNodeButton).toBeInTheDocument();
      expect(deleteNodeButton).toBeInTheDocument();
    });
  });

  it('renders and shows update table with button disabled', async () => {
    render(<Settings />, { wrapper: RouterWithQueryClientWrapper });
    vi.mocked(ServiceContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: {
        ...mockedService,
        capabilities: {
          service: {
            update: database.service.capability.StateEnum.disabled,
          },
          nodes: {
            delete: database.service.capability.StateEnum.disabled,
            create: database.service.capability.StateEnum.disabled,
          },
        },
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, Error>,
    });
    const updateVersionButton = screen.getByTestId(
      'update-button-tableVersion',
    );
    const updatePlanButton = screen.getByTestId('update-button-tablePlan');
    const updateFlavorButton = screen.getByTestId('update-button-tableFlavor');
    const updateStorageButton = screen.getByTestId(
      'update-button-tableStorage',
    );
    const createNodeButton = screen.getByTestId('create-node-button');
    const deleteNodeButton = screen.getByTestId('delete-node-button');
    await waitFor(() => {
      expect(screen.getByText(mockedServiceOrig.plan)).toBeInTheDocument();
      expect(updateVersionButton).toBeInTheDocument();
      expect(updateVersionButton).toBeDisabled();
      expect(updatePlanButton).toBeInTheDocument();
      expect(updatePlanButton).toBeDisabled();
      expect(updateFlavorButton).toBeInTheDocument();
      expect(updateFlavorButton).toBeDisabled();
      expect(updateStorageButton).toBeInTheDocument();
      expect(updateStorageButton).toBeDisabled();
      expect(createNodeButton).toBeInTheDocument();
      expect(createNodeButton).toBeDisabled();
      expect(deleteNodeButton).toBeInTheDocument();
      expect(deleteNodeButton).toBeDisabled();
    });
  });
});

describe('Open modals', () => {
  beforeEach(async () => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    vi.mocked(ServiceContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: mockedService,
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, Error>,
    });
    render(<Settings />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedServiceOrig.plan)).toBeInTheDocument();
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('open and close add updateVersionModal', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('update-button-tableVersion'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('update-version-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('update-version-cancel-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('update-version-modal'),
      ).not.toBeInTheDocument();
    });
  });

  it('open and close add updatePlanModal', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('update-button-tablePlan'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('update-plan-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('update-plan-cancel-button'));
    });
    await waitFor(() => {
      expect(screen.queryByTestId('update-plan-modal')).not.toBeInTheDocument();
    });
  });

  it('open and close add updateFlavorModal', async () => {
    const ResizeObserverMock = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));

    // Stub the global ResizeObserver
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    act(() => {
      fireEvent.click(screen.getByTestId('update-button-tableFlavor'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('update-flavor-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('update-flavor-cancel-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('update-flavor-modal'),
      ).not.toBeInTheDocument();
    });
  });

  it('open and close add node modal', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('create-node-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('add-node-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-node-cancel-button'));
    });
    await waitFor(() => {
      expect(screen.queryByTestId('add-node-modal')).not.toBeInTheDocument();
    });
  });

  it('call add node on add node success', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('create-node-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('add-node-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-node-submit-button'));
    });
    await waitFor(() => {
      expect(screen.queryByTestId('add-node-modal')).not.toBeInTheDocument();
      expect(nodesApi.addNode).toHaveBeenCalled();
    });
  });

  it('open and close delete node modal', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('delete-node-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('delete-node-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-node-cancel-button'));
    });
    await waitFor(() => {
      expect(screen.queryByTestId('delete-node-modal')).not.toBeInTheDocument();
    });
  });

  it('call deleteNode on delete node success', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('delete-node-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('delete-node-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-node-submit-button'));
    });
    await waitFor(() => {
      expect(screen.queryByTestId('delete-node-modal')).not.toBeInTheDocument();
      expect(nodesApi.deleteNode).toHaveBeenCalled();
    });
  });
});
