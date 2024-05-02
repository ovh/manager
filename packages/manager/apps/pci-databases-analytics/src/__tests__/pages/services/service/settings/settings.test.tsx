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
import Settings from '@/pages/services/[serviceId]/settings';
import { database } from '@/models/database';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService as mockedServiceOrig } from '@/__tests__/helpers/mocks/services';
import { mockedCatalog } from '@/__tests__/helpers/mocks/catalog';
import {
  mockedAvailabilities,
  mockedCapabilities,
  mockedEngineCapabilities,
  mockedRegionCapabilities,
  mockedSuggestions,
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

describe('Settings page', () => {
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

    vi.mock('@/api/databases/availabilities', () => ({
      getCapabilities: vi.fn(() => mockedCapabilities),
      getEnginesCapabilities: vi.fn(() => [mockedEngineCapabilities]),
      getRegionsCapabilities: vi.fn(() => [mockedRegionCapabilities]),
      getAvailabilities: vi.fn(() => [mockedAvailabilities]),
    }));

    vi.mock('@/api/databases/maintenances', () => ({
      getMaintenances: vi.fn(() => [mockedMaintenance]),
      applyMaintenance: vi.fn((maintenance) => maintenance),
    }));

    vi.mock('@/api/databases/advancedConfiguration', () => ({
      getAdvancedConfiguration: vi.fn(() => mockAdvancedConfiguration),
      getAdvancedConfigurationCapabilities: vi.fn(() => mockCapabilities),
    }));

    vi.mock('@/pages/services/[serviceId]/layout', () => ({
      useServiceData: vi.fn(() => ({
        projectId: 'projectId',
        service: mockedService,
        category: 'operational',
        serviceQuery: {} as UseQueryResult<database.Service, Error>,
      })),
    }));

    vi.mock('@ovh-ux/manager-react-shell-client', () => {
      return {
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
        screen.getByText(mockedServiceOrig.description),
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
    vi.mocked(LayoutContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: {
        ...mockedService,
        capabilities: {
          advancedConfiguration: {},
        },
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, Error>,
    });
    render(<Settings />, { wrapper: RouterWithQueryClientWrapper });
    expect(
      screen.queryByTestId('advanced-config-accordion-trigger'),
    ).toBeNull();
  });
});
