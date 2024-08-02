import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import * as LayoutContext from '@/pages/services/[serviceId]/layout';
import * as serviceApi from '@/api/databases/service';
import Settings from '@/pages/services/[serviceId]/settings';
import { database } from '@/models/database';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import {
  mockedServiceInte,
  mockedService as mockedServiceOrig,
} from '@/__tests__/helpers/mocks/services';
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
import { mockedIntegrations } from '@/__tests__/helpers/mocks/integrations';

// Override mock to add capabilities
const mockedService = {
  ...mockedServiceOrig,
  capabilities: {
    service: {
      update: database.service.capability.StateEnum.enabled,
      delete: database.service.capability.StateEnum.enabled,
    },
    maintenanceTime: {
      read: database.service.capability.StateEnum.enabled,
      update: database.service.capability.StateEnum.enabled,
    },
    backupTime: {
      read: database.service.capability.StateEnum.enabled,
      update: database.service.capability.StateEnum.enabled,
    },
    maintenanceApply: {
      create: database.service.capability.StateEnum.enabled,
    },
    integrations: {
      create: database.service.capability.StateEnum.enabled,
      update: database.service.capability.StateEnum.enabled,
      delete: database.service.capability.StateEnum.enabled,
      read: database.service.capability.StateEnum.enabled,
    },
  },
};

describe('Service configuration page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));

    vi.mock('@/api/catalog', () => ({
      catalogApi: {
        getCatalog: vi.fn(() => mockedCatalog),
      },
    }));

    vi.mock('@/api/databases/integrations', () => ({
      getServiceIntegrations: vi.fn(() => [mockedIntegrations]),
    }));

    vi.mock('@/api/databases/availabilities', () => ({
      getCapabilities: vi.fn(() => mockedCapabilities),
      getEnginesCapabilities: vi.fn(() => [mockedEngineCapabilities]),
      getRegionsCapabilities: vi.fn(() => [mockedRegionCapabilities]),
      getAvailabilities: vi.fn(() => [
        mockedAvailabilities,
        mockedAvailabilitiesUpdate,
      ]),
    }));

    vi.mock('@/api/databases/maintenances', () => ({
      getMaintenances: vi.fn(() => [mockedMaintenance]),
    }));

    vi.mock('@/api/databases/service', () => ({
      updateService: vi.fn((service) => service),
      deleteService: vi.fn(),
      getServices: vi.fn(() => [mockedServiceOrig, mockedServiceInte]),
    }));

    vi.mock('@/pages/services/[serviceId]/layout', () => ({
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
      Trans: ({ children }: any) => children,
    }));
  });

  it('renders and shows skeletons while loading', async () => {
    render(<Settings />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByTestId('maintenance-settings-skeleton'),
      ).toBeInTheDocument();
    });
  });

  it('renders and shows service configuration with action', async () => {
    render(<Settings />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByTestId('service-configuration-table'),
      ).toBeInTheDocument();
      expect(screen.getByText(mockedService.description)).toBeInTheDocument();
    });
    expect(screen.getByTestId('maintenance-time-cell')).toBeInTheDocument();
    expect(screen.getByTestId('backup-time-cell')).toBeInTheDocument();
    expect(
      screen.getByTestId('service-confi-rename-button'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('service-confi-delete-button'),
    ).toBeInTheDocument();
  });

  it('renders and shows service configuration without button', async () => {
    vi.mocked(LayoutContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: {
        ...mockedService,
        capabilities: {
          maintenanceApply: {
            create: database.service.capability.StateEnum.enabled,
          },
        },
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, Error>,
    });
    render(<Settings />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.queryByTestId('maintenance-time-cell'),
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('backup-time-cell')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('service-confi-rename-button'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('service-confi-delete-button'),
      ).not.toBeInTheDocument();
    });
  });

  it('renders and shows service configuration with button disabled', async () => {
    vi.mocked(LayoutContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: {
        ...mockedService,
        capabilities: {
          service: {
            update: database.service.capability.StateEnum.disabled,
            delete: database.service.capability.StateEnum.disabled,
          },
          maintenanceTime: {
            read: database.service.capability.StateEnum.enabled,
            update: database.service.capability.StateEnum.disabled,
          },
          backupTime: {
            read: database.service.capability.StateEnum.enabled,
            update: database.service.capability.StateEnum.enabled,
          },
          maintenanceApply: {
            create: database.service.capability.StateEnum.enabled,
          },
        },
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, Error>,
    });
    render(<Settings />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.queryByTestId('maintenance-time-cell')).toBeInTheDocument();
      expect(screen.queryByTestId('backup-time-cell')).toBeInTheDocument();
      expect(
        screen.queryByTestId('service-confi-rename-button'),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('service-confi-rename-button'),
      ).toBeDisabled();
      expect(
        screen.queryByTestId('service-confi-delete-button'),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('service-confi-delete-button'),
      ).toBeDisabled();
    });
  });
});

describe('Open modals', () => {
  beforeEach(async () => {
    vi.mocked(LayoutContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: mockedService,
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, Error>,
    });
    render(<Settings />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedService.description)).toBeInTheDocument();
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('open and close rename service Modal', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('service-confi-rename-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('rename-service-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.keyDown(screen.getByTestId('rename-service-modal'), {
        key: 'Escape',
        code: 'Escape',
      });
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('rename-service-modal'),
      ).not.toBeInTheDocument();
    });
  });

  it('call update service on rename success', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('service-confi-rename-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('rename-service-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.change(screen.getByTestId('rename-service-input'), {
        target: {
          value: 'newName',
        },
      });
      fireEvent.click(screen.getByTestId('rename-service-submit-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('rename-service-modal'),
      ).not.toBeInTheDocument();
      expect(serviceApi.updateService).toHaveBeenCalled();
    });
  });

  it('open and close delete service Modal', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('service-confi-delete-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('delete-service-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-service-cancel-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('delete-service-modal'),
      ).not.toBeInTheDocument();
    });
  });

  it('call delete service on success', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('service-confi-delete-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('delete-service-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-service-submit-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('delete-service-modal'),
      ).not.toBeInTheDocument();
      expect(serviceApi.deleteService).toHaveBeenCalled();
    });
  });
});
