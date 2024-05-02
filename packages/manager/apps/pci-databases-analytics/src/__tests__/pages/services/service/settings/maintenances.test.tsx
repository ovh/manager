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
import * as maintenanceApi from '@/api/databases/maintenances';
import { database } from '@/models/database';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService as mockedServiceOrig } from '@/__tests__/helpers/mocks/services';
import { mockedCatalog } from '@/__tests__/helpers/mocks/catalog';
import {
  mockedAvailabilities,
  mockedCapabilities,
  mockedEngineCapabilities,
  mockedRegionCapabilities,
} from '@/__tests__/helpers/mocks/availabilities';
import { mockedMaintenanceTer } from '@/__tests__/helpers/mocks/maintenances';
import { mockedUser } from '@/__tests__/helpers/mocks/user';
import { Locale } from '@/hooks/useLocale';

// Override mock to add capabilities
const mockedService = {
  ...mockedServiceOrig,
  capabilities: {
    maintenanceApply: {
      create: database.service.capability.StateEnum.enabled,
    },
  },
};

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
      getMaintenances: vi.fn(() => [mockedMaintenanceTer]),
      applyMaintenance: vi.fn((maintenance) => maintenance),
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
        screen.getByTestId('maintenance-settings-skeleton'),
      ).toBeInTheDocument();
    });
  });

  it('renders and shows maintenances', async () => {
    render(<Settings />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByText(mockedMaintenanceTer.description),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('apply-maintenance-button'),
      ).toBeInTheDocument();
    });
  });

  it('Apply maintenance should trigger API call', async () => {
    render(<Settings />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByText(mockedMaintenanceTer.description),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('apply-maintenance-button'),
      ).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('apply-maintenance-button'));
    });
    await waitFor(() => {
      expect(maintenanceApi.applyMaintenance).toHaveBeenCalled();
    });
  });

  it('does not display advanced config if capability is absent', async () => {
    vi.mocked(LayoutContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: {
        ...mockedService,
        capabilities: {
          maintenanceApply: {
            create: database.service.capability.StateEnum.disabled,
          },
        },
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, Error>,
    });
    render(<Settings />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByText(mockedMaintenanceTer.description),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('apply-maintenance-button'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('apply-maintenance-button')).toBeDisabled();
    });
  });
});
