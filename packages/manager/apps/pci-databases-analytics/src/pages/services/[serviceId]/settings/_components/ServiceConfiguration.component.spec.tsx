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
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';
import Settings from '@/pages/services/[serviceId]/settings/Settings.page';
import * as database from '@/types/cloud/project/database';
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
import { mockedIntegrations } from '@/__tests__/helpers/mocks/integrations';
import { CdbError } from '@/data/api/database';

// Override mock to add capabilities
const mockedService = {
  ...mockedServiceOrig,
  capabilities: {
    service: {
      update: database.service.capability.StateEnum.enabled,
      delete: database.service.capability.StateEnum.enabled,
    },
    deletionProtection: {
      read: database.service.capability.StateEnum.enabled,
      update: database.service.capability.StateEnum.enabled,
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
    serviceIpRestriction: {
      update: database.service.capability.StateEnum.enabled,
    },
    serviceFlavor: {
      update: database.service.capability.StateEnum.enabled,
    },
    serviceDisk: {
      update: database.service.capability.StateEnum.enabled,
    },
  },
};

vi.mock('@/data/api/catalog/catalog.api', () => ({
  catalogApi: {
    getCatalog: vi.fn(() => mockedCatalog),
  },
}));

vi.mock('@/data/api/database/integration.api', () => ({
  getServiceIntegrations: vi.fn(() => [mockedIntegrations]),
}));

vi.mock('@/data/api/database/availability.api', () => ({
  getCapabilities: vi.fn(() => mockedCapabilities),
  getEnginesCapabilities: vi.fn(() => [mockedEngineCapabilities]),
  getRegionsCapabilities: vi.fn(() => [mockedRegionCapabilities]),
  getAvailabilities: vi.fn(() => [
    mockedAvailabilities,
    mockedAvailabilitiesUpdate,
  ]),
}));

vi.mock('@/data/api/database/maintenance.api', () => ({
  getMaintenances: vi.fn(() => [mockedMaintenance]),
}));

vi.mock('@/data/api/database/service.api', () => ({
  editService: vi.fn((service) => service),
  deleteService: vi.fn(),
  getServices: vi.fn(() => [mockedServiceOrig, mockedServiceInte]),
}));

vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
  useServiceData: vi.fn(() => ({
    projectId: 'projectId',
    service: mockedService,
    category: 'operational',
    serviceQuery: {} as UseQueryResult<database.Service, Error>,
  })),
}));

describe('Service configuration page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
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
    });
    expect(screen.getByTestId('maintenance-time')).toBeInTheDocument();
    expect(screen.getByTestId('backup-time')).toBeInTheDocument();
    expect(
      screen.getByTestId('service-config-delete-button'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('service-config-deletion-protection-link'),
    ).toBeInTheDocument();
  });

  it('renders and shows service configuration without button', async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValue({
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
      serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
    });
    render(<Settings />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.queryByTestId('maintenance-time')).not.toBeInTheDocument();
      expect(screen.queryByTestId('backup-time')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('service-config-rename-button'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('service-config-delete-button'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('service-config-deletion-protection-link'),
      ).not.toBeInTheDocument();
    });
  });

  it('renders and shows service configuration with button disabled', async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValue({
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
          deletionProtection: {
            read: database.service.capability.StateEnum.enabled,
            update: database.service.capability.StateEnum.disabled,
          },
          serviceFlavor: {
            update: database.service.capability.StateEnum.disabled,
          },
          serviceDisk: {
            update: database.service.capability.StateEnum.disabled,
          },
        },
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
    });
    render(<Settings />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.queryByTestId('maintenance-time')).toBeInTheDocument();
      expect(screen.queryByTestId('backup-time')).toBeInTheDocument();
      expect(
        screen.queryByTestId('service-config-delete-button'),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('service-config-delete-button'),
      ).toBeDisabled();
      const deleteProtectionButton = screen.getByTestId(
        'service-config-deletion-protection-link',
      );
      expect(deleteProtectionButton).toBeInTheDocument();
      expect(deleteProtectionButton.className).toContain('cursor-not-allowed');
    });
  });
});

describe('Open modals', () => {
  beforeEach(async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: mockedService,
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
    });
    render(<Settings />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByTestId('service-configuration-table'),
      ).toBeInTheDocument();
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('open delete service Modal', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('service-config-delete-button'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./delete');
    });
  });
});
