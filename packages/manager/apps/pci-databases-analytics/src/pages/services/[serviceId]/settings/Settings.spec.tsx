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
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService as mockedServiceOrig } from '@/__tests__/helpers/mocks/services';
import { mockedCatalog } from '@/__tests__/helpers/mocks/catalog';
import {
  mockedAvailabilities,
  mockedCapabilities,
  mockedEngineCapabilities,
  mockedRegionCapabilities,
} from '@/__tests__/helpers/mocks/availabilities';
import { mockedMaintenance } from '@/__tests__/helpers/mocks/maintenances';
import { CdbError } from '@/data/api/database';

// Override mock to add capabilities
const mockedService = {
  ...mockedServiceOrig,
  capabilities: {
    service: {
      update: database.service.capability.StateEnum.enabled,
    },
    advancedConfiguration: {
      create: database.service.capability.StateEnum.enabled,
      update: database.service.capability.StateEnum.enabled,
      delete: database.service.capability.StateEnum.enabled,
      read: database.service.capability.StateEnum.enabled,
    },
    maintenanceApply: {
      create: database.service.capability.StateEnum.enabled,
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

const mockAdvancedConfiguration = { capability: 'capabilityMocked' };

const mockCapabilities: database.capabilities.advancedConfiguration.Property[] = [
  {
    name: 'capability',
    type: database.capabilities.advancedConfiguration.property.TypeEnum.string,
    description: 'capabilityMocked',
  },
];

vi.mock('@/data/api/catalog/catalog.api', () => ({
  catalogApi: {
    getCatalog: vi.fn(() => mockedCatalog),
  },
}));

vi.mock('@/data/api/database/availability.api', () => ({
  getAvailabilities: vi.fn(() => [mockedAvailabilities]),
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

vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
  useServiceData: vi.fn(() => ({
    projectId: 'projectId',
    service: mockedService,
    category: 'operational',
    serviceQuery: {} as UseQueryResult<database.Service, Error>,
  })),
}));

describe('Settings page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
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

  it('renders and shows update table, ips config, maintenance and service configuration', async () => {
    render(<Settings />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedServiceOrig.plan)).toBeInTheDocument();
      expect(screen.getByText(mockedServiceOrig.flavor)).toBeInTheDocument();
      expect(
        screen.getByText(mockedServiceOrig.ipRestrictions[0].ip),
      ).toBeInTheDocument();
      expect(
        screen.getByText(mockedMaintenance.description),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('service-configuration-table'),
      ).toBeInTheDocument();
    });
  });

  it('renders and shows advanced config when triggering the accordion', async () => {
    render(<Settings />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByTestId('advanced-config-accordion-trigger'),
      ).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('advanced-config-accordion-trigger'));
    });
    await waitFor(() => {
      expect(
        screen.getByText(mockAdvancedConfiguration.capability),
      ).toBeInTheDocument();
    });
  });

  it('does not display advanced config if capability is absent', async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: {
        ...mockedService,
        capabilities: {
          advancedConfiguration: {},
        },
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
    });
    render(<Settings />, { wrapper: RouterWithQueryClientWrapper });
    expect(
      screen.queryByTestId('advanced-config-accordion-trigger'),
    ).toBeNull();
  });
});
