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
import Settings from '@/pages/services/[serviceId]/settings/Settings.page';
import * as database from '@/types/cloud/project/database';
import * as advancedConfigurationAPI from '@/data/api/database/advancedConfiguration.api';
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
  {
    name: 'capability1',
    type: database.capabilities.advancedConfiguration.property.TypeEnum.boolean,
    description: 'capability1Mocked',
  },
  {
    name: 'capability2',
    type: database.capabilities.advancedConfiguration.property.TypeEnum.double,
    description: 'capability2Mocked',
  },
  {
    name: 'capability3',
    type: database.capabilities.advancedConfiguration.property.TypeEnum.long,
    description: 'capability3Mocked',
  },
];

describe('Advanced configuration in settings page', () => {
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
      editAdvancedConfiguration: vi.fn((advConfig) => advConfig),
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

    const ResizeObserverMock = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
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

  it('add and remove an advanced configuration', async () => {
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
      expect(screen.getByTestId('advanced-config-input')).toBeInTheDocument();
      expect(
        screen.getByTestId('advanced-config-add-button'),
      ).toBeInTheDocument();
    });
    act(() => {
      const button = screen.getByRole('combobox');
      fireEvent.click(button);
    });
    await waitFor(() => {
      expect(screen.getByText('capability3')).toBeInTheDocument();
      const itemToSelect = screen.getByText('capability3');
      fireEvent.click(itemToSelect);
    });
    act(() => {
      fireEvent.click(screen.getByTestId('advanced-config-add-button'));
    });
    await waitFor(() => {
      expect(
        screen.getByTestId('remove-property-capability3'),
      ).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('remove-property-capability3'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('remove-property-capability3'),
      ).not.toBeInTheDocument();
    });
  });

  it('add and cancel an advanced configuration', async () => {
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
      expect(screen.getByTestId('advanced-config-input')).toBeInTheDocument();
      expect(
        screen.getByTestId('advanced-config-add-button'),
      ).toBeInTheDocument();
    });
    act(() => {
      const button = screen.getByRole('combobox');
      fireEvent.click(button);
    });
    await waitFor(() => {
      expect(screen.getByText('capability3')).toBeInTheDocument();
      const itemToSelect = screen.getByText('capability3');
      fireEvent.click(itemToSelect);
    });
    act(() => {
      fireEvent.click(screen.getByTestId('advanced-config-add-button'));
    });
    await waitFor(() => {
      expect(
        screen.getByTestId('remove-property-capability3'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('advanced-config-cancel-button'),
      ).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('advanced-config-cancel-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('remove-property-capability3'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('advanced-config-cancel-button'),
      ).not.toBeInTheDocument();
    });
  });

  it('add advanced configuration on success', async () => {
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
      expect(screen.getByTestId('advanced-config-input')).toBeInTheDocument();
      expect(
        screen.getByTestId('advanced-config-add-button'),
      ).toBeInTheDocument();
    });
    act(() => {
      const button = screen.getByRole('combobox');
      fireEvent.click(button);
    });
    await waitFor(() => {
      expect(screen.getByText('capability3')).toBeInTheDocument();
      const itemToSelect = screen.getByText('capability3');
      fireEvent.click(itemToSelect);
    });
    act(() => {
      fireEvent.click(screen.getByTestId('advanced-config-add-button'));
    });
    act(() => {
      const button = screen.getByRole('combobox');
      fireEvent.click(button);
    });
    await waitFor(() => {
      expect(screen.getByText('capability1')).toBeInTheDocument();
      const itemToSelect = screen.getByText('capability1');
      fireEvent.click(itemToSelect);
    });
    act(() => {
      fireEvent.click(screen.getByTestId('advanced-config-add-button'));
    });
    act(() => {
      const button = screen.getByRole('combobox');
      fireEvent.click(button);
    });
    await waitFor(() => {
      expect(screen.getByText('capability2')).toBeInTheDocument();
      const itemToSelect = screen.getByText('capability2');
      fireEvent.click(itemToSelect);
    });
    act(() => {
      fireEvent.click(screen.getByTestId('advanced-config-add-button'));
    });
    await waitFor(() => {
      expect(
        screen.getByTestId('advanced-config-submit-button'),
      ).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('advanced-config-submit-button'));
    });
    await waitFor(() => {
      expect(
        advancedConfigurationAPI.editAdvancedConfiguration,
      ).toHaveBeenCalled();
    });
  });
});
